import _ from 'lodash';
import hash from 'object-hash';
import moment from 'moment';
import { take, call, select, put } from 'redux-saga/effects';
import { takeEvery, isCancelError } from 'redux-saga';
import { normalize, arrayOf } from 'normalizr';
import {
	getApiService,
	getAuthContext,
	getEntityMappingGetter,
	getEntityGetter,
	getEntitySchemaGetter,
	getEntityStatusGetter
} from 're-app/selectors';
import {
	ENSURE_ENTITY,
	MERGE_ENTITY,
	PERSIST_ENTITY,
	receiveEntities,
	confirmEntity,
	receiveEnsureEntityFailure,
	fetchEntity,
	receiveFetchEntityFailure,
	mergeEntity,
	confirmEntityMerged,
	receiveEntityMergeFailure,
	persistEntity,
	receivePersistEntitySuccess,
	receivePersistEntityFailure
} from './actions';

export function *entityFlow() {
	yield takeEvery(ENSURE_ENTITY, ensureEntityTask);
}

export function *ensureEntityTask(action) {
	const { collectionName, entityId } = action.payload;
	let entity = yield select(getEntityGetter(collectionName, entityId));
	if (!entity) {
		try {
			yield call(fetchEntityTask, collectionName, entityId);
			yield put(confirmEntity(collectionName, entityId));
		} catch (e) {
			if (!isCancelError(e)) {
				yield put(receiveEnsureEntityFailure(collectionName, entityId));
			}
		}
	} else {
		yield put(confirmEntity(collectionName, entityId));
	}
}

export function *fetchEntityTask(collectionName, id) {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	yield put(fetchEntity(collectionName, id));
	try {
		const result = yield call(ApiService.getEntity, collectionName, id, authContext);
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		const normalized = normalize(result.data, entityMapping);
		yield put(receiveEntities(normalized.entities, moment().format()));
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(receiveFetchEntityFailure(collectionName, id));
			throw e;
		}
	}
}

export function *mergeEntityFlow() {
	yield takeEvery(MERGE_ENTITY, mergeEntityTask);
}

export function *mergeEntityTask(action) {
	const { collectionName, entityId, data } = action.payload;

	try {
		yield call(persistEntityTask, collectionName, entityId, data);
		yield put(confirmEntityMerged(collectionName, entityId));
	} catch (e) {
		debugger;
		if (!isCancelError(e)) {
			yield put(receiveEntityMergeFailure(collectionName, id));
		}
	}
}

export function *persistEntityTask(collectionName, entityId, data) {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	//const entitySchema = yield select(getEntitySchemaGetter(collectionName));
	const entityStatus = yield select(getEntityStatusGetter(collectionName, entityId));
	let remoteEntityId = entityId;
	let transientEntityId;
	if (entityStatus.transient) {
		remoteEntityId = undefined;
		transientEntityId = entityId;
	}


	// check for transient entities in associations and plan next persist
	//_.each(entitySchema.fields, (field) => {
	//	if (field.type === 'association') {
	//
	//	}
	//});


	yield put(persistEntity(collectionName, entityId));
	try {
		let persistResult = yield call(ApiService.persistEntity, collectionName, remoteEntityId, _.cloneDeep(data), authContext);
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		const normalizedEntity = normalize(persistResult.data, entityMapping);
		remoteEntityId = normalizedEntity.result;
		//const remoteEntity = normalizedEntity.entities[collectionName][remoteEntityId];
		//yield put(receiveEntities(normalizedEntity.entities, moment().format()));
		yield put(receivePersistEntitySuccess(collectionName, remoteEntityId, normalizedEntity.entities, transientEntityId, moment().format()));
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(receivePersistEntityFailure(collectionName, entityId, e.entityValidationErrors));
		}
	}
}

export default [entityFlow, mergeEntityFlow];
