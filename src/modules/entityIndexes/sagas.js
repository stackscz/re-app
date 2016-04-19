/* eslint-disable */

import _ from 'lodash';
import hash from 'object-hash';
import moment from 'moment';
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
	ENSURE_ENTITY_INDEX,
	ensureEntityIndex,
	confirmEntityIndex,
	ensureEntityIndexFailure,
	fetchEntityIndex,
	receiveEntityIndex,
	fetchEntityIndexFailure
} from './actions';
import {
	RECEIVE_PERSIST_ENTITY_SUCCESS
} from '../entityStorage/actions';
import { actions as entityStorageActions } from 're-app/modules/entityStorage';

export function *entityIndexesFlow() {
	yield takeEvery(ENSURE_ENTITY_INDEX, ensureEntityIndexTask);
}

export function *ensureEntityIndexTask(action) {
	const { collectionName, filter } = action.payload;

	const indexHash = hash({collectionName, filter});
	const entityIndex = yield select(getEntityIndexGetter(indexHash));
	if (!entityIndex.valid) {
		try {
			yield call(fetchEntityIndexTask, indexHash);
			yield put(confirmEntityIndex(indexHash));
		} catch (e) {
			if (!isCancelError(e)) {
				yield put(ensureEntityIndexFailure(indexHash));
			}
		}
	} else {
		yield put(confirmEntityIndex(indexHash));
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
		const nowTime = moment().format();
		yield put(entityStorageActions.receiveEntities(normalized.entities, nowTime));
		yield put(receiveEntityIndex(indexHash, normalized.result, result.existingCount, nowTime));
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(fetchEntityIndexFailure(indexHash, e.errors));
			throw e;
		}
	}
}

export function *invalidationFlow() {
	yield takeEvery(RECEIVE_PERSIST_ENTITY_SUCCESS, reloadInvalidIndexesTask);
}

export function *reloadInvalidIndexesTask(action) {
	const indexes = yield select((state) => state.entityIndexes.indexes);
	for (let indexHash of Object.keys(indexes)) {
		const index = indexes[indexHash];
		if (!index.valid) {
			yield put(ensureEntityIndex(index.collectionName, index.filter));
		}
	}
}

export default [entityIndexesFlow, invalidationFlow];
