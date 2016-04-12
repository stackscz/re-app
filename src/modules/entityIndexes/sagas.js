/* eslint-disable */

import hash from 'object-hash';
import { take, call, select, put } from 'redux-saga/effects';
import { takeEvery, isCancelError } from 'redux-saga';
import { normalize, arrayOf } from 'normalizr';
import {
	getApiService,
	getAuthContext,
	getEntityIndexGetter,
	getEntityGetter,
	getEntityMappingGetter
} from 're-app/selectors';
import {
	ENSURE_ENTITY_INDEX
	,ensureEntityIndexSuccess
	,ensureEntityIndexFailure
	,fetchEntityIndex
	,fetchEntityIndexSuccess
	,fetchEntityIndexFailure
} from './actions';
import { actions as entityStorageActions } from 're-app/modules/entityStorage';

export function *entityIndexesFlow() {
	yield takeEvery(ENSURE_ENTITY_INDEX, ensureEntityIndexTask);
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
		const normalized = normalize(result.data, arrayOf(entityMapping));
		yield put(entityStorageActions.storeEntities(normalized.entities));
		yield put(fetchEntityIndexSuccess(indexHash, normalized.result, result.existingCount));
	} catch (e) {
		if (!isCancelError(e)) {
			//debugger;
			yield put(fetchEntityIndexFailure(indexHash, e.errors));
			throw e;
		}
	}
}

export default [entityIndexesFlow];
