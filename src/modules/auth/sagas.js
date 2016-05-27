import { take, fork, call, put, select, cancel } from 'redux-saga/effects';

import { apiServiceResultTypeInvariant } from 'utils';
import t from 'tcomb';
import {
	AuthContext,
	AuthError
} from './types';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getUser, getAuthContext } from './selectors';
import {
	LOGIN,
	LOGIN_FAILURE,
	LOGOUT,
	initialize,
	initializeFinish,
	loginSuccess,
	loginFailure,
	logoutSuccess,
	logoutFailure
} from './actions';

export function* authFlow() {
	const ApiService = yield select(getApiService);
	const initialAuthContext = yield select(getAuthContext);
	const initializedAuthContext = yield call(ApiService.getInitialAuthContext, initialAuthContext);
	yield put(initialize(initializedAuthContext));
	const apiContext = yield select(getApiContext);
	const serviceAuthContext = yield call(ApiService.initializeAuth, apiContext, initializedAuthContext);
	apiServiceResultTypeInvariant(serviceAuthContext, AuthContext);
	yield put(initializeFinish(serviceAuthContext));
	while (true) { // eslint-disable-line no-constant-condition
		const user = yield select(getUser);
		let authorizeTask = null;
		let logoutTask;
		if (!user) {
			const loginAction = yield take(LOGIN);
			const authContext = yield select(getAuthContext);
			authorizeTask = yield fork(authorize, loginAction.payload, apiContext, authContext);
			if (logoutTask) {
				yield cancel(logoutTask);
			}
		}

		const action = yield take([LOGOUT, LOGIN_FAILURE]);
		if (action.type === LOGOUT) {
			if (authorizeTask) {
				yield cancel(authorizeTask);
			}
			yield call(logout);
		}
	}
}

export function* authorize(credentials, apiContext, authContext) {
	const apiService = yield select(getApiService);
	try {
		const result = yield call(apiService.login, credentials, apiContext, authContext);
		apiServiceResultTypeInvariant(result, t.struct({user: t.Object}));
		yield put(loginSuccess(result));
	} catch (e) {
		apiServiceResultTypeInvariant(e, AuthError);
		yield put(loginFailure(e.errors));
	}
}

export function* logout() {
	const apiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const apiContext = yield select(getApiContext);
	try {
		yield call(apiService.logout, apiContext, authContext);
		yield put(logoutSuccess());
	} catch (e) {
		apiServiceResultTypeInvariant(e, AuthError);
		yield put(logoutFailure());
	}
}

export default [authFlow];
