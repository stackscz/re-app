/* eslint-disable */

import _ from 'lodash';
import hash from 'object-hash';
import moment from 'moment';

import { apiServiceResultTypeInvariant } from 're-app/utils';
import { EntityIndexResult } from './types';
import { ApiErrorResult, ApiValidationErrorResult } from 're-app/utils/types';

import { take, call, select, put, fork } from 'redux-saga/effects';
import { takeEvery, isCancelError } from 'redux-saga';
import { normalize, arrayOf } from 'normalizr';
import { getApiContext, getApiService } from 're-app/modules/api/selectors';
import { getAuthContext } from 're-app/modules/auth/selectors';
import { getEntityGetter } from 're-app/modules/entityStorage/selectors';
import { getEntityMappingGetter } from 're-app/modules/entityDescriptors/selectors';
import { getEntityIndexGetter } from './selectors';
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
	RECEIVE_PERSIST_ENTITY_SUCCESS,
	RECEIVE_DELETE_ENTITY_SUCCESS
} from '../entityStorage/actions';
import { actions as entityStorageActions } from 're-app/modules/entityStorage';

const ensureEntityIndexTasks = {};

export function *entityIndexesFlow() {
	yield takeLatestEnsure(ensureEntityIndexTask);
}

function *takeLatestEnsure(saga) {
	while (true) {
		const action = yield take((action) => {
			return action.type === ENSURE_ENTITY_INDEX && action.payload;
		});
		const { collectionName, filter } = action.payload;
		const indexHash = hash({collectionName, filter});
		if (!ensureEntityIndexTasks[indexHash] || !ensureEntityIndexTasks[indexHash].isRunning()) {
			ensureEntityIndexTasks[indexHash] = yield fork(saga, action);
		}
	}
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
			apiServiceResultTypeInvariant(e, ApiErrorResult);
			yield put(ensureEntityIndexFailure(indexHash));
		}
	} else {
		yield put(confirmEntityIndex(indexHash));
	}
}

export function *fetchEntityIndexTask(indexHash) {
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const {collectionName, filter} = yield select(getEntityIndexGetter(indexHash));
	yield put(fetchEntityIndex(indexHash));
	try {
		const result = yield call(ApiService.getEntityIndex, collectionName, filter, apiContext, authContext);
		apiServiceResultTypeInvariant(result, EntityIndexResult);
		const entityMapping = yield select(getEntityMappingGetter(collectionName));
		const normalized = normalize(result.data, arrayOf(entityMapping));
		const nowTime = moment().format();
		yield put(entityStorageActions.receiveEntities(normalized.entities, nowTime));
		yield put(receiveEntityIndex(indexHash, normalized.result, result.existingCount, nowTime));
	} catch (e) {
		apiServiceResultTypeInvariant(e, ApiErrorResult);
		yield put(fetchEntityIndexFailure(indexHash, e.errors));
	}
}

export function *invalidationPersistFlow() {
	yield takeEvery(RECEIVE_PERSIST_ENTITY_SUCCESS, reloadInvalidIndexesTask);
}

export function *invalidationDeleteFlow() {
	yield takeEvery(RECEIVE_DELETE_ENTITY_SUCCESS, reloadInvalidIndexesTask);
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

export default [entityIndexesFlow, invalidationPersistFlow, invalidationDeleteFlow];
