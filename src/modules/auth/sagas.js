// @flow
import { take, fork, call, put, select, cancel } from 'redux-saga/effects';

import t from 'tcomb';
import type { ApiContext } from 'types/ApiContext';
import type { AuthContext } from 'types/AuthContext';
import type { Error } from 'types/Error';

import rethrowError from 'utils/rethrowError';
import apiServiceResultTypeInvariant from 'utils/apiServiceResultTypeInvariant';
import isOfType from 'utils/isOfType';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getAuthContext } from './selectors';
import {
	LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT,
	initialize,
	initializeFinish,
	loginSuccess,
	loginFailure,
	logoutSuccess,
	logoutFailure,
} from './actions';

export function* authorize(credentials, apiContext:ApiContext, authContext:AuthContext) {
	const apiService = yield select(getApiService);
	let apiCallResult;
	try {
		apiCallResult = yield call(apiService.login, credentials, apiContext, authContext);
	} catch (apiCallError) {
		rethrowError(apiCallError);
		if (!isOfType(apiCallError, Error)) {
			yield put(
				loginFailure(
					{
						code: 5000,
						message: 'Invalid error response',
						originalResponse: apiCallError,
					}
				)
			);
			return;
		}
		yield put(loginFailure(apiCallError));
		return;
	}

	if (!isOfType(apiCallResult, t.struct({ user: t.Object }))) {
		yield put(
			loginFailure(
				{
					code: 4000,
					message: 'Api did not return user',
					originalResponse: apiCallResult,
				}
			)
		);
		return;
	}

	yield put(loginSuccess(apiCallResult.user));
}

export function* logout() {
	const apiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const apiContext = yield select(getApiContext);
	try {
		yield call(apiService.logout, apiContext, authContext);
		yield put(logoutSuccess());
	} catch (apiCallError) {
		rethrowError(apiCallError);
		if (!isOfType(apiCallError, Error)) {
			yield put(
				logoutFailure(
					{
						code: 5000,
						message: 'Unknown error on logout',
						originalResponse: apiCallError,
					}
				)
			);
			return;
		}
		yield put(logoutFailure(apiCallError));
	}
}

export function* authFlow() {
	const ApiService = yield select(getApiService);
	const initialAuthContext = yield select(getAuthContext);
	const initializedAuthContext = yield call(ApiService.getInitialAuthContext, initialAuthContext);
	yield put(initialize(initializedAuthContext));
	const apiContext = yield select(getApiContext);
	const serviceAuthContext = yield call(
		ApiService.initializeAuth,
		apiContext,
		initializedAuthContext
	);
	apiServiceResultTypeInvariant(serviceAuthContext, AuthContext);
	yield put(initializeFinish(serviceAuthContext));
	while (true) { // eslint-disable-line no-constant-condition
		let authorizeTask = null;
		let logoutTask;
		const authContext = yield select(getAuthContext);
		const action = yield take([LOGIN, LOGOUT, LOGIN_FAILURE, LOGIN_SUCCESS]);
		switch (action.type) {
			case LOGIN:
				authorizeTask = yield fork(authorize, action.payload, apiContext, authContext);
				if (logoutTask) {
					yield cancel(logoutTask);
				}
				break;
			case LOGOUT:
				if (authorizeTask) {
					yield cancel(authorizeTask);
				}
				yield call(logout);
				break;
			default:
				break;
		}
	}
}

export default [authFlow];
