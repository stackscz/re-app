/* eslint-disable */

import hash from 'object-hash';
import { take, call, select, put } from 'redux-saga/effects';
import { takeEvery, isCancelError } from 'redux-saga';
import {
	getApiService,
	getAuthContext,
	getEntityIndexGetter,
	getEntityGetter,
	getEntityMappingGetter
} from 're-app/selectors';
import {
	ENSURE_ENTITY_INDEX
	,ENSURE_ENTITY
	,ensureEntityIndexSuccess
	,ensureEntityIndexFailure
	,fetchEntityIndex
	,fetchEntityIndexSuccess
	,fetchEntityIndexFailure
	,ensureEntitySuccess
	,ensureEntityFailure
	,fetchEntity
	,fetchEntitySuccess
	,fetchEntityFailure
} from './actions';

export function *entityIndexesFlow() {
	yield takeEvery(ENSURE_ENTITY_INDEX, ensureEntityIndexTask);
}

export function *entityFlow() {
	yield takeEvery(ENSURE_ENTITY, ensureEntityTask);
}

export function *ensureEntityIndexTask(action) {
	const { collectionName, filter } = action.payload;

	const indexHash = hash({collectionName, filter});
	const entityIndex = yield select(getEntityIndexGetter(indexHash));
	if (!entityIndex.ready) {
		try {
			yield call(fetchEntityIndexTask, indexHash);
			yield put(ensureEntityIndexSuccess(indexHash));
		} catch (e) {
			if (!isCancelError(e)) {
				yield put(ensureEntityIndexFailure(indexHash));
			}
		}
	} else {
		yield put(ensureEntityIndexSuccess(indexHash));
	}
}

export function *fetchEntityIndexTask(indexHash) {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const {collectionName, filter} = yield select(getEntityIndexGetter(indexHash));
	yield put(fetchEntityIndex(indexHash));
	try {
		const result = yield call(ApiService.getEntityIndex, collectionName, filter, authContext);
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		yield put(fetchEntityIndexSuccess(indexHash, entityMapping, result.existingCount, result.data));
	} catch (e) {
		if (!isCancelError(e)) {
			//debugger;
			yield put(fetchEntityIndexFailure(indexHash, e.errors));
			throw e;
		}
	}
}

export function *ensureEntityTask(action) {
	const { collectionName, entityId: id } = action.payload;

	let entity;
	try {
		entity = yield select(getEntityGetter(collectionName, id));
	} catch (e) {
		entity = null;
	}
	if (!entity) {
		try {
			yield call(fetchEntityTask, collectionName, id);
			const fetchedEntity = yield select(getEntityGetter(collectionName, id));
			yield put(ensureEntitySuccess(collectionName, id, fetchedEntity));
		} catch (e) {
			if (!isCancelError(e)) {
				yield put(ensureEntityFailure(collectionName, id));
			}
		}
	} else {
		yield put(ensureEntitySuccess(collectionName, id, entity));
	}
}

export function *fetchEntityTask(collectionName, id) {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	try {
		const result = yield call(ApiService.getEntity, collectionName, id, authContext);
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		yield put(fetchEntitySuccess(collectionName, id, entityMapping, result.data));
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(fetchEntityFailure(collectionName, id));
			throw e;
		}
	}
}

export default [entityIndexesFlow, entityFlow];
