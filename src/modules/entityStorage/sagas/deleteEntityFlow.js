import rethrowError from 'utils/rethrowError';
import apiServiceResultTypeInvariant from 'utils/apiServiceResultTypeInvariant';
import type { Error } from 'types/Error';

import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from 'modules/auth/selectors';
import { getEntityResourceSelector } from 'modules/entityDescriptors/selectors';
import {
	DELETE_ENTITY,
	receiveDeleteEntitySuccess,
	receiveDeleteEntityFailure,
} from '../actions';

export function *deleteEntityTask(action) {
	const { modelName, entityId } = action.payload;
	const apiContext = yield select(getApiContext);
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);

	try {
		const deleteEntityResource = yield select(getEntityResourceSelector(modelName, 'DELETE'));
		yield call(
			ApiService.deleteEntity,
			modelName,
			entityId,
			deleteEntityResource,
			apiContext,
			authContext
		);
		yield put(receiveDeleteEntitySuccess(modelName, entityId));
	} catch (e) {
		rethrowError(e);
		apiServiceResultTypeInvariant(e, Error);
		yield put(receiveDeleteEntityFailure(modelName, entityId));
	}
}

export default function *deleteEntityFlow() {
	yield takeEvery(DELETE_ENTITY, deleteEntityTask);
}
