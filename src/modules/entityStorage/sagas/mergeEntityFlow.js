import _ from 'lodash';
import moment from 'moment';
import hash from 'object-hash';

import invariant from 'invariant';
import { rethrowError, typeInvariant, apiServiceResultTypeInvariant } from 're-app/utils';
import {
	ApiService
} from 're-app/modules/api/types';
import {
	EntityResult
} from '../types';
import { ApiValidationErrorResult } from 'utils/types';

import { takeEvery } from 'redux-saga';
import { call, select, put, fork } from 'redux-saga/effects';

import normalize from 'utils/normalize';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import { getEntityMappingGetter, getEntitySchemaGetter } from 'modules/entityDescriptors/selectors';
import {
	getEntityStatusGetter,
	getDenormalizedEntityGetter
} from '../selectors';
import {
	MERGE_ENTITY,
	PERSIST_ENTITY,
	persistEntity,
	receivePersistEntitySuccess,
	receivePersistEntityFailure
} from '../actions';

export default function *mergeEntityFlow() {
	yield fork(function *takeMergeEntity() {
		yield takeEvery(MERGE_ENTITY, mergeEntityTask);
	});
	yield fork(function *takePersistEntity() {
		yield takeEvery(PERSIST_ENTITY, persistEntityTask);
	});
}

export function *mergeEntityTask(action) {
	const { collectionName, data, noInteraction } = action.payload;
	const entitySchema = yield select(getEntitySchemaGetter(collectionName));

	let entityId = data[entitySchema.idFieldName];
	if (!entityId) {
		entityId = hash({data, r: Math.random()});
	}

	const entityMapping = yield select(getEntityMappingGetter(collectionName));
	const normalizedData = normalize({...data, [entitySchema.idFieldName]: entityId}, entityMapping);
	const normalizedEntity = normalizedData.entities[collectionName][normalizedData.result];

	yield put(persistEntity(entitySchema, entityId, normalizedEntity, noInteraction))
}

export function *persistEntityTask(action) {
	const { entitySchema, entityId, entity, noInteraction } = action.payload;
	if (noInteraction) {
		// do not call api
		return;
	}
	const collectionName = entitySchema.name;

	// ApiService is needed to merge entity
	const apiService = yield select(getApiService);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// EntityMapping is needed to normalize entity
	const entityMapping = yield select(getEntityMappingGetter(collectionName));
	invariant(entityMapping, 'entityStorage module depends on entityDescriptors module');

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
		const denormalizedEntity = yield select(getDenormalizedEntityGetter(collectionName, entityId));
		let persistResult;
		if (remoteEntityId) {
			persistResult = yield call(apiService.updateEntity, collectionName, remoteEntityId, denormalizedEntity, apiContext, authContext);
		} else {
			const {[entitySchema.idFieldName]: idFieldValue, ...strippedIdEntity} = denormalizedEntity; // eslint-disable-line no-unused-vars
			persistResult = yield call(apiService.createEntity, collectionName, strippedIdEntity, apiContext, authContext);
		}
		apiServiceResultTypeInvariant(persistResult, EntityResult);

		const normalizedEntity = normalize(persistResult.data, entityMapping);
		remoteEntityId = normalizedEntity.result;
		yield put(receivePersistEntitySuccess(collectionName, remoteEntityId, normalizedEntity.entities, transientEntityId, moment().format()));
	} catch (e) {
		rethrowError(e);
		apiServiceResultTypeInvariant(e, ApiValidationErrorResult);
		yield put(receivePersistEntityFailure(collectionName, entityId, e, e.validationErrors));
	}

}
