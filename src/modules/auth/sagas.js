/* eslint-disable */
import _ from 'lodash';
import invariant from 'invariant';
import { isCancelError } from 'redux-saga';
import { take, fork, call, put, select, cancel } from 'redux-saga/effects';
import { getApiService, getUser, getAuthContext } from 're-app/selectors';
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
	yield put(initialize());
	const ApiService = yield select(getApiService);
	const initialAuthContext = yield select(getAuthContext);
	const serviceAuthContext = yield call(ApiService.initializeAuth, initialAuthContext);
	yield put(initializeFinish(serviceAuthContext));
	while (true) { // eslint-disable-line no-constant-condition
		const user = yield select(getUser);
		let authorizeTask = null;
		let logoutTask;
		if (!user) {
			const loginAction = yield take(LOGIN);
			const authContext = yield select(getAuthContext);
			authorizeTask = yield fork(authorize, loginAction.payload, authContext);
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

export function* authorize(credentials, authContext) {
	const ApiService = yield select(getApiService);
	try {
		const result = yield call(ApiService.login, credentials, authContext);
		invariant(_.isObject(result.user), 'ApiService login() implementation should return object containing user key');
		yield put(loginSuccess(result));
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(loginFailure(e));
		}
	}
}

export function* logout() {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	try {
		yield call(ApiService.logout, authContext);
		yield put(logoutSuccess());
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(logoutFailure());
		}
	}
}

export default [authFlow];
