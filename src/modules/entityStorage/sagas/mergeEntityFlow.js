// @flow
import _ from 'lodash';
import moment from 'moment';
import hash from 'object-hash';

import {
	rethrowError,
	isOfType,
	typeInvariant,
} from 'utils';
import type { ApiService } from 'types/ApiService';
import type { EntityResult } from 'types/EntityResult';
import type { EntityValidationError } from 'types/EntityValidationError';

import { takeEvery } from 'redux-saga';
import { call, select, put, fork } from 'redux-saga/effects';

import normalize from 'modules/entityDescriptors/utils/normalize';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import {
	getEntityDefinitions,
	getModelIdPropertyName,
} from 'modules/entityDescriptors/selectors';
import {
	getEntitySelector,
} from 'modules/entityStorage/selectors';
import stripReadOnlyProperties from 'modules/entityDescriptors/utils/stripReadOnlyProperties';
import {
	getEntityStatusSelector,
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
	const { modelName, where, data, noInteraction } = action.payload;
	const idPropertyName = yield select(getModelIdPropertyName(modelName));

	let entityId = data[idPropertyName];
	if (!entityId) {
		entityId = hash({ data, r: Math.random() });
	}

	const existingEntity = yield select(getEntitySelector(modelName, entityId));
	const updatedEntity = _.assign({}, existingEntity || {}, data);
	const entityDefinitions = yield select(getEntityDefinitions);
	const {
		// result,
		entities,
	} = normalize(
		{
			...updatedEntity,
			[idPropertyName]: entityId,
		},
		_.get(entityDefinitions, modelName)
	);
	// const normalizedEntity = entities[modelName][result];

	yield put(persistEntity(modelName, entityId, where, entities, noInteraction));
}

export function *persistEntityTask(action) {
	const { modelName, entityId, where, noInteraction } = action.payload;
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
	const entityStatus = yield select(getEntityStatusSelector(modelName, entityId));

	let remoteEntityId = entityId;
	let transientEntityId;
	if (!entityStatus || entityStatus.transient) {
		remoteEntityId = undefined;
		transientEntityId = entityId;
	}

	const denormalizedEntity = yield select(
		getDenormalizedEntitySelector(modelName, entityId)
	);
	// const modelSchema = yield select(getEntityDefinitionSelector(modelName));
	const strippedEntity = stripReadOnlyProperties(
		denormalizedEntity,
		_.get(entityDefinitions, modelName)
	);

	let persistResult;
	try {
		const apiServiceMethodName = remoteEntityId ? 'updateEntity' : 'createEntity';
		persistResult = yield call(
			apiService[apiServiceMethodName],
			modelName,
			where,
			strippedEntity,
			apiContext,
			authContext
		);
	} catch (error) {
		rethrowError(error);
		if (!isOfType(error, EntityValidationError)) {
			yield put(receivePersistEntityFailure(
				modelName,
				entityId,
				{
					code: 5000,
					message: 'Invalid error',
					data: error,
				}
			));
			return;
		}
		yield put(receivePersistEntityFailure(modelName, entityId, error));
		return;
	}

	if (!isOfType(persistResult, EntityResult)) {
		yield put(
			receivePersistEntityFailure(
				modelName,
				entityId,
				{
					code: 5000,
					message: 'Invalid entity response',
					data: persistResult,
				}
			)
		);
		return;
	}

	const {
		result: resultEntityId,
		entities,
	} = normalize(
		persistResult.data,
		_.get(entityDefinitions, modelName)
	);
	yield put(
		receivePersistEntitySuccess(
			modelName,
			resultEntityId,
			entities,
			transientEntityId,
			moment().format()
		)
	);
}

export default function *mergeEntityFlow() {
	yield fork(function *takeMergeEntity() {
		yield takeEvery(MERGE_ENTITY, mergeEntityTask);
	});
	yield fork(function *takePersistEntity() {
		yield takeEvery(PERSIST_ENTITY, persistEntityTask);
	});
}
