import { rethrowError, apiServiceResultTypeInvariant } from 're-app/utils';
import type { Error } from 'types/Error';

import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import { getApiContext, getApiService } from 're-app/modules/api/selectors';
import { getAuthContext } from 're-app/modules/auth/selectors';
import {
	DELETE_ENTITY,
	receiveDeleteEntitySuccess,
	receiveDeleteEntityFailure,
} from '../actions';

export function *deleteEntityTask(action) {
	const { collectionName, entityId } = action.payload;
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);

	try {
		yield call(ApiService.deleteEntity, collectionName, entityId, apiContext, authContext);
		yield put(receiveDeleteEntitySuccess(collectionName, entityId));
	} catch (e) {
		rethrowError(e);
		apiServiceResultTypeInvariant(e, Error);
		yield put(receiveDeleteEntityFailure(collectionName, entityId));
	}
}

export default function *deleteEntityFlow() {
	yield takeEvery(DELETE_ENTITY, deleteEntityTask);
}
