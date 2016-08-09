// @flow
import _ from 'lodash';
import moment from 'moment';
import hash from 'object-hash';

import { rethrowError, typeInvariant, apiServiceResultTypeInvariant } from 're-app/utils';
import type { ApiService } from 'types/ApiService';
import type { EntityResult } from 'types/EntityResult';
import type { EntityValidationError } from 'types/EntityValidationError';

import { takeEvery } from 'redux-saga';
import { call, select, put, fork } from 'redux-saga/effects';

import normalize from 'modules/entityDescriptors/utils/normalize';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import {
	getEntityDefinitionSelector,
	getEntityDefinitions,
} from 'modules/entityDescriptors/selectors';
import {
	getEntitySelector,
} from 'modules/entityStorage/selectors';
import stripReadOnlyProperties from 'modules/entityDescriptors/utils/stripReadOnlyProperties';
import {
	getEntityStatusGetter,
	getDenormalizedEntitySelector,
} from '../selectors';
import {
	MERGE_ENTITY,
	PERSIST_ENTITY,
	persistEntity,
	receivePersistEntitySuccess,
	receivePersistEntityFailure,
} from '../actions';

export function *mergeEntityTask(action) {
	const { modelName, data, noInteraction } = action.payload;
	const entitySchema = yield select(getEntityDefinitionSelector(modelName));

	let entityId = data[entitySchema['x-idPropertyName']];
	if (!entityId) {
		entityId = hash({ data, r: Math.random() });
	}

	const existingEntity = yield select(getEntitySelector(modelName, entityId));
	const updatedEntity = _.assign({}, existingEntity || {}, data);
	const entityDefinitions = yield select(getEntityDefinitions);
	const normalizedData = normalize(
		{
			...updatedEntity,
			[entitySchema['x-idPropertyName']]: entityId,
		},
		modelName,
		entityDefinitions
	);
	const normalizedEntity = normalizedData.entities[modelName][normalizedData.result];

	yield put(persistEntity(modelName, entitySchema, entityId, normalizedEntity, noInteraction));
}

export function *persistEntityTask(action) {
	const { modelName, entitySchema, entityId, noInteraction } = action.payload;
	if (noInteraction) {
		// do not call api
		return;
	}

	// ApiService is needed to merge entity
	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// EntityMapping is needed to normalize entity
	const entityDefinitions = yield select(getEntityDefinitions);

	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);
	const entityStatus = yield select(getEntityStatusGetter(modelName, entityId));

	let remoteEntityId = entityId;
	let transientEntityId;
	if (!entityStatus || entityStatus.transient) {
		remoteEntityId = undefined;
		transientEntityId = entityId;
	}

	try {
		const denormalizedEntity = yield select(
			getDenormalizedEntitySelector(modelName, entityId)
		);
		const strippedEntity = stripReadOnlyProperties(denormalizedEntity, entitySchema);
		let persistResult;
		if (remoteEntityId) {
			persistResult = yield call(
				apiService.updateEntity,
				modelName,
				remoteEntityId,
				strippedEntity,
				apiContext,
				authContext
			);
		} else {
			persistResult = yield call(
				apiService.createEntity,
				modelName,
				strippedEntity,
				apiContext,
				authContext
			);
		}
		apiServiceResultTypeInvariant(persistResult, EntityResult);

		const normalizationResult = normalize(
			{
				...denormalizedEntity,
				...persistResult.data,
			},
			modelName,
			entityDefinitions
		);
		remoteEntityId = normalizationResult.result;
		yield put(
			receivePersistEntitySuccess(
				modelName,
				remoteEntityId,
				normalizationResult.entities,
				transientEntityId,
				moment().format()
			)
		);
	} catch (error) {
		rethrowError(error);
		apiServiceResultTypeInvariant(error, EntityValidationError);
		yield put(receivePersistEntityFailure(modelName, entityId, error));
	}
}

export default function *mergeEntityFlow() {
	yield fork(function *takeMergeEntity() {
		yield takeEvery(MERGE_ENTITY, mergeEntityTask);
	});
	yield fork(function *takePersistEntity() {
		yield takeEvery(PERSIST_ENTITY, persistEntityTask);
	});
}
