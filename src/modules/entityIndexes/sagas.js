/* eslint-disable */

import hash from 'object-hash';
import { take, call, select, put } from 'redux-saga/effects';
import { takeEvery, isCancelError } from 'redux-saga';
import { getApiService, getAuthContext, getEntityIndexGetter, getEntityGetter, getEntityMappingGetter } from 're-app/selectors';
import {
	ENSURE_ENTITY_INDEX
	,ENSURE_ENTITY
	,ensureEntityIndexSuccess
	,ensureEntityIndexFailure
	,fetchEntityIndexSuccess
	,fetchEntityIndexFailure
	,ensureEntitySuccess
	,ensureEntityFailure
	,fetchEntitySuccess
	,fetchEntityFailure
} from './actions';

export function *entityIndexesFlow() {
	yield takeEvery(ENSURE_ENTITY_INDEX, ensureEntityIndex);
}

export function *entityFlow() {
	yield takeEvery(ENSURE_ENTITY, ensureEntity);
}

export function *ensureEntityIndex(action) {
	const { collectionName, filter } = action.payload;

	let indexHash = hash({collectionName, filter});
	const entityIndex = yield select(getEntityIndexGetter(indexHash));
	if (!entityIndex) {
		try {
			const entities = yield call(fetchEntityIndex, collectionName, filter, indexHash);
			yield put(ensureEntityIndexSuccess(collectionName, filter, entities));
		} catch (e) {
			if (!isCancelError(e)) {
				yield put(ensureEntityIndexFailure(collectionName, filter));
			}
		}
	} else {
		yield put(ensureEntityIndexSuccess(collectionName, filter, []));
	}
}

export function *fetchEntityIndex(collectionName, filter, indexHash) {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	try {
		const result = yield call(ApiService.getEntityIndex, collectionName, filter, authContext);
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		yield put(fetchEntityIndexSuccess(collectionName, filter, indexHash, entityMapping, result.existingCount, result.data));
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(fetchEntityIndexFailure(collectionName, filter));
			throw e;
		}
	}
}

export function *ensureEntity(action) {
	const { collectionName, id } = action.payload;

	const entity = yield select(getEntityGetter(id));
	if (!entity) {
		try {
			yield call(fetchEntity, collectionName, id);
			yield put(ensureEntitySuccess(collectionName, id, entity));
		} catch (e) {
			if (!isCancelError(e)) {
				yield put(ensureEntityFailure(collectionName, id));
			}
		}
	} else {
		yield put(ensureEntitySuccess(collectionName, id, entity));
	}
}

export function *fetchEntity(collectionName, id) {
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
