// @flow
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
	getEntitySchemaGetter,
	getEntitySchemas,
	getEntityResourceSelector,
} from 'modules/entityDescriptors/selectors';
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
	const entitySchema = yield select(getEntitySchemaGetter(modelName));

	let entityId = data[entitySchema.idFieldName];
	if (!entityId) {
		entityId = hash({ data, r: Math.random() });
	}

	const entitySchemas = yield select(getEntitySchemas);
	const normalizedData = normalize(
		{ ...data, [entitySchema.idFieldName]: entityId },
		entitySchema.name,
		entitySchemas
	);
	const normalizedEntity = normalizedData.entities[modelName][normalizedData.result];

	yield put(persistEntity(entitySchema, entityId, normalizedEntity, noInteraction));
}

export function *persistEntityTask(action) {
	const { entitySchema, entityId, noInteraction } = action.payload;
	if (noInteraction) {
		// do not call api
		return;
	}
	const modelName = entitySchema.name;

	// ApiService is needed to merge entity
	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// EntityMapping is needed to normalize entity
	const entitySchemas = yield select(getEntitySchemas);

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
			const updateEntityResource = yield select(getEntityResourceSelector(modelName, 'UPDATE'));
			persistResult = yield call(
				apiService.updateEntity,
				modelName,
				remoteEntityId,
				strippedEntity,
				updateEntityResource,
				apiContext,
				authContext
			);
		} else {
			const createEntityResource = yield select(getEntityResourceSelector(modelName, 'CREATE'));
			persistResult = yield call(
				apiService.createEntity,
				modelName,
				strippedEntity,
				createEntityResource,
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
			entitySchema.name,
			entitySchemas
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
