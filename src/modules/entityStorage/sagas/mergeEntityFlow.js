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
} from 'modules/entityDescriptors/selectors';
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
	const { collectionName, data, noInteraction } = action.payload;
	const entitySchema = yield select(getEntitySchemaGetter(collectionName));

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
	const normalizedEntity = normalizedData.entities[collectionName][normalizedData.result];

	yield put(persistEntity(entitySchema, entityId, normalizedEntity, noInteraction));
}

export function *persistEntityTask(action) {
	const { entitySchema, entityId, noInteraction } = action.payload;
	if (noInteraction) {
		// do not call api
		return;
	}
	const collectionName = entitySchema.name;

	// ApiService is needed to merge entity
	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// EntityMapping is needed to normalize entity
	const entitySchemas = yield select(getEntitySchemas);

	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);
	const entityStatus = yield select(getEntityStatusGetter(collectionName, entityId));

	let remoteEntityId = entityId;
	let transientEntityId;
	if (!entityStatus || entityStatus.transient) {
		remoteEntityId = undefined;
		transientEntityId = entityId;
	}

	try {
		const denormalizedEntity = yield select(getDenormalizedEntitySelector(collectionName, entityId));
		let persistResult;
		if (remoteEntityId) {
			persistResult = yield call(
				apiService.updateEntity,
				collectionName,
				remoteEntityId,
				denormalizedEntity,
				apiContext,
				authContext
			);
		} else {
			const {
				[entitySchema.idFieldName]: idFieldValue, // eslint-disable-line no-unused-vars
				...strippedIdEntity,
				} = denormalizedEntity;
			persistResult = yield call(
				apiService.createEntity,
				collectionName,
				strippedIdEntity,
				apiContext,
				authContext
			);
		}
		apiServiceResultTypeInvariant(persistResult, EntityResult);

		const normalizationResult = normalize(
			persistResult.data,
			entitySchema.name,
			entitySchemas
		);
		remoteEntityId = normalizationResult.result;
		yield put(
			receivePersistEntitySuccess(
				collectionName,
				remoteEntityId,
				normalizationResult.entities,
				transientEntityId,
				moment().format()
			)
		);
	} catch (error) {
		rethrowError(error);
		apiServiceResultTypeInvariant(error, EntityValidationError);
		yield put(receivePersistEntityFailure(collectionName, entityId, error));
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
