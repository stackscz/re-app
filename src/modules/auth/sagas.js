import _ from 'lodash';
import invariant from 'invariant';
import { isCancelError } from 'redux-saga';
import { take, fork, call, put, select, cancel } from 'redux-saga/effects';
import {
	LOGIN,
	LOGIN_FAILURE,
	LOGOUT,
	init,
	loginSuccess,
	loginFailure,
	logoutSuccess,
	logoutFailure
} from './actions';
import {getApiService, getUser, getAuth} from './selectors';

export function* authFlow() {
	yield put(init());
	while (true) { // eslint-disable-line no-constant-condition
		const user = yield select(getUser);
		let authorizeTask;
		let logoutTask;
		if (!user) {
			const loginAction = yield take(LOGIN);
			const authContext = yield select(getAuth);
			authorizeTask = yield fork(authorize, loginAction.payload, authContext);
			if (logoutTask) {
				yield cancel(logoutTask);
			}
		}

		const action = yield take([LOGOUT, LOGIN_FAILURE]);
		if (action.type === LOGOUT && authorizeTask) {
			yield cancel(authorizeTask);
			yield call(logout);
		}
	}
}

export function* authorize(credentials, authContext) {
	const ApiService = yield select(getApiService);
	try {
		const result = yield call(ApiService.login, credentials, authContext);
		invariant(_.isObject(result.user), 'ApiService login() implementation should return object containing user object');
		yield put(loginSuccess(result));
	} catch (e) {
		if (!isCancelError(e)) {
			yield put(loginFailure());
		}
	}
}

export function* logout() {
	const ApiService = yield select(getApiService);
	const authContext = yield select(getAuth);
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
