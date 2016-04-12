import hash from 'object-hash';
import { take, call, select, put } from 'redux-saga/effects';
import { takeEvery, isCancelError } from 'redux-saga';
import { normalize, arrayOf } from 'normalizr';
import {
	getApiService,
	getAuthContext,
	getEntityMappingGetter,
	getEntityGetter,
	getEntitySchemaGetter
} from 're-app/selectors';
import {
	ENSURE_ENTITY,
	MERGE_ENTITY,
	storeEntities,
	ensureEntitySuccess,
	ensureEntityFailure,
	fetchEntity,
	fetchEntitySuccess,
	fetchEntityFailure,
	persistEntity,
	persistEntitySuccess,
	persistEntityFailure
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
			yield put(ensureEntitySuccess(collectionName, entityId));
		} catch (e) {
			if (!isCancelError(e)) {
				yield put(ensureEntityFailure(collectionName, entityId));
			}
		}
	} else {
		yield put(ensureEntitySuccess(collectionName, entityId));
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
		yield put(storeEntities(normalized.entities));
		yield put(fetchEntitySuccess(collectionName, id));
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(fetchEntityFailure(collectionName, id));
			throw e;
		}
	}
}

export default [entityFlow];
