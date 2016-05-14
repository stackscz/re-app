import _ from 'lodash';
import moment from 'moment';

import invariant from 'invariant';
import { rethrowError, typeInvariant, apiServiceResultTypeInvariant } from 're-app/utils';
import {
	ApiService
} from 're-app/modules/api/types';
import {
	EntityResult
} from '../types';
import { ApiValidationErrorResult } from 're-app/utils/types';

import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { normalize } from 'normalizr';

import { getApiContext, getApiService } from 're-app/modules/api/selectors';
import { getAuthContext } from 're-app/modules/auth/selectors';
import { getEntityMappingGetter, getEntitySchemaGetter } from 're-app/modules/entityDescriptors/selectors';
import {
	getEntityStatusGetter,
	getDenormalizedEntityGetter
} from '../selectors';
import {
	MERGE_ENTITY,
	confirmEntityMerged,
	receiveEntityMergeFailure,
	persistEntity,
	receivePersistEntitySuccess,
	receivePersistEntityFailure
} from '../actions';


export default function *mergeEntityFlow() {
	yield takeEvery(MERGE_ENTITY, mergeEntityTaskNew);
}

export function *mergeEntityTaskNew(action) {
	const { entitySchema, data } = action.payload;
	const collectionName = entitySchema.name;
	const entityId = data[entitySchema.idFieldName];
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
		yield put(receivePersistEntityFailure(collectionName, entityId, e.entityValidationErrors));
	}

}

export function *mergeEntityTask(action) {
	const { entitySchema, data } = action.payload;
	const collectionName = entitySchema.name;
	const entityId = data[entitySchema.idFieldName];
	try {
		yield call(persistEntityTask, collectionName, entityId, data);
		yield put(confirmEntityMerged(collectionName, entityId));
	} catch (e) {
		rethrowError(e);
		yield put(receiveEntityMergeFailure(collectionName, entityId));
	}
}

export function *persistEntityTask(collectionName, entityId, data) {
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const entitySchema = yield select(getEntitySchemaGetter(collectionName));
	const entityStatus = yield select(getEntityStatusGetter(collectionName, entityId));
	let remoteEntityId = entityId;
	let transientEntityId;
	if (!entityStatus || entityStatus.transient) {
		remoteEntityId = undefined;
		transientEntityId = entityId;
	}

	// start persisting
	yield put(persistEntity(collectionName, entityId));

	// wait until all dependent entities are persisted
	//const entityStatuses = yield select(state => state.entityStorage.statuses);
	//const entitySchemas = yield select(state => state.entityDescriptors.schemas);
	//while (containsTransientEntitiesInAssociations(collectionName, data, entitySchemas, entityStatuses)) {
	//	yield take([RECEIVE_PERSIST_ENTITY_SUCCESS, RECEIVE_PERSIST_ENTITY_FAILURE]);
	//	console.log('Dependency saved!');
	//}

	try {
		let persistResult;
		if (remoteEntityId) {
			persistResult = yield call(ApiService.updateEntity, collectionName, remoteEntityId, _.cloneDeep(data), apiContext, authContext);
		} else {
			const {[entitySchema.idFieldName]: idFieldValue, ...strippedIdEntity} = _.cloneDeep(data); // eslint-disable-line no-unused-vars
			persistResult = yield call(ApiService.createEntity, collectionName, strippedIdEntity, apiContext, authContext);
		}

		apiServiceResultTypeInvariant(persistResult, EntityResult);
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		const normalizedEntity = normalize(persistResult.data, entityMapping);
		remoteEntityId = normalizedEntity.result;
		yield put(receivePersistEntitySuccess(collectionName, remoteEntityId, normalizedEntity.entities, transientEntityId, moment().format()));
	} catch (e) {
		rethrowError(e);
		apiServiceResultTypeInvariant(e, ApiValidationErrorResult);
		yield put(receivePersistEntityFailure(collectionName, entityId, e.entityValidationErrors));
	}
}


// utils
//function containsTransientEntitiesInAssociations(collectionName, entity, entitySchemas, entityStatuses) {
//	const entitySchema = entitySchemas[collectionName];
//	let result = false;
//	_.each(entitySchema.fields, (fieldSchema, fieldName) => {
//		if (fieldSchema.type === 'association') {
//			if (!fieldSchema.isMultiple) {
//				result = entity[fieldName] && isEntityTransient(fieldSchema.collectionName, entity[fieldName], entityStatuses);
//			} else {
//				result = _.reduce(entity[fieldName], (result, assocId) => {
//					return result || isEntityTransient(fieldSchema.collectionName, assocId, entityStatuses);
//				}, false);
//			}
//			if (result) {
//				return false;
//			}
//		}
//	});
//	return result;
//}

//function isEntityTransient(collectionName, entityId, entityStatuses) {
//	return entityStatuses[collectionName][entityId].transient;
//}
