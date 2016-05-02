import validateApiServiceResult from 're-app/modules/api/validateApiServiceResult';
import {
	initializeAuth as initializeAuthResultType,
	login as loginResultType,
	loginError as loginErrorResultType,
	logout as logoutResultType,
	logoutError as logoutErrorResultType
} from 're-app/modules/api/resultTypes';

import { isCancelError } from 'redux-saga';
import { take, fork, call, put, select, cancel } from 'redux-saga/effects';

import { getApiContext, getApiService } from 're-app/modules/api/selectors';
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
	validateApiServiceResult('initializeAuth', serviceAuthContext, initializeAuthResultType);
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
	const ApiService = yield select(getApiService);
	try {
		const result = yield call(ApiService.login, credentials, apiContext, authContext);
		validateApiServiceResult('login', result, loginResultType);
		yield put(loginSuccess(result));
	} catch (e) {
		if (!isCancelError(e)) {
			validateApiServiceResult('loginError', e, loginErrorResultType);
			yield put(loginFailure(e));
		}
	}
}

export function* logout() {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const apiContext = yield select(getApiContext);
	try {
		const logoutResult = yield call(ApiService.logout, apiContext, authContext);
		validateApiServiceResult('logout', logoutResult, logoutResultType);
		yield put(logoutSuccess());
	} catch (e) {
		if (!isCancelError(e)) {
			validateApiServiceResult('logoutError', e, logoutErrorResultType);
			yield put(logoutFailure());
		}
	}
}

export default [authFlow];
