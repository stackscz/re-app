// @flow
import { takeLatest } from 'redux-saga';
import { take, fork, call, put, select, cancel } from 'redux-saga/effects';

import t from 'tcomb';
import moment from 'moment';
import type { Error } from 'types/Error';

import rethrowError from 'utils/rethrowError';
import isOfType from 'utils/isOfType';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getEntitySchemas } from 'modules/entityDescriptors/selectors';

import normalize from 'modules/entityDescriptors/utils/normalize';

import {
	receiveEntities,
	forgetEntity,
} from 'modules/entityStorage/actions';

import {
	getAuthState,
	getAuthContext,
	getUserId,
} from './selectors';
import {
	LOGIN,
	RECEIVE_IDENTITY,
	RECEIVE_LOGIN_FAILURE,
	LOGOUT,
	REFRESH_IDENTITY,
	initialize,
	initializeFinish,
	receiveIdentity,
	receiveLoginSuccess,
	receiveLoginFailure,
	receiveLogoutSuccess,
	receiveLogoutFailure,
} from './actions';

export function *normalizeUserTask(user) {
	if (!isOfType(user, t.Object)) {
		return {
			userId: null,
		};
	}
	const { userModelName } = yield select(getAuthState);
	const entitySchemas = yield select(getEntitySchemas);
	const {
		result: userId,
		entities,
	} = normalize(user, userModelName, entitySchemas);
	return {
		userId,
		entities,
	};
}

export function* refreshIdentityTask() {
	const ApiService = yield select(getApiService);
	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);
	let user = null;
	let freshAuthContext = authContext;
	try {
		({ user, authContext: freshAuthContext } = yield call(
			ApiService.refreshAuth,
			apiContext,
			authContext
		));
	} catch (error) {
		rethrowError(error);
		// TODO put error action
		console.error('refreshAuth should always resolve');
	}

	const { userModelName } = yield select(getAuthState);
	const originalUserId = yield select(getUserId);

	const {
		userId,
		entities,
	} = yield call(normalizeUserTask, user);

	if (userId) {
		yield put(receiveEntities(entities, moment().format()));
		yield put(receiveIdentity(userId, freshAuthContext));
	} else {
		yield put(receiveIdentity(null, freshAuthContext));
	}

	if (originalUserId && originalUserId !== userId) {
		yield put(forgetEntity(userModelName, originalUserId));
	}
}

export function *watchRefreshIdentity() {
	yield takeLatest(REFRESH_IDENTITY, refreshIdentityTask);
}

export function* loginTask(credentials) {
	const apiService = yield select(getApiService);
	const apiContext = yield select(getApiContext);
	const authContext = yield select(getAuthContext);
	let user = null;
	let freshAuthContext = authContext;
	try {
		({ user, authContext: freshAuthContext } = yield call(
			apiService.login,
			credentials,
			apiContext,
			freshAuthContext
		));
	} catch (apiCallError) {
		rethrowError(apiCallError);
		if (!isOfType(apiCallError, Error)) {
			yield put(
				receiveLoginFailure(
					{
						code: 5000,
						message: 'Invalid error response',
						originalResponse: apiCallError,
					}
				)
			);
			return;
		}
		yield put(receiveLoginFailure(apiCallError));
		return;
	}

	// TODO validate user type

	const {
		userId,
		entities,
	} = yield call(normalizeUserTask, user);

	const { userModelName } = yield select(getAuthState);
	const originalUserId = yield select(getUserId);

	yield put(receiveEntities(entities, moment().format()));
	yield put(receiveLoginSuccess(userId, freshAuthContext));

	if (originalUserId && originalUserId !== userId) {
		yield put(forgetEntity(userModelName, originalUserId));
	}
}

export function* logoutTask() {
	const apiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const apiContext = yield select(getApiContext);
	let freshAuthContext = authContext;
	try {
		freshAuthContext = yield call(apiService.logout, apiContext, freshAuthContext);
	} catch (apiCallError) {
		rethrowError(apiCallError);
		if (!isOfType(apiCallError, Error)) {
			yield put(
				receiveLogoutFailure(
					{
						code: 5000,
						message: 'Unknown error on logout',
						originalResponse: apiCallError,
					}
				)
			);
			return;
		}
		yield put(receiveLogoutFailure(apiCallError));
		return;
	}

	const { userModelName } = yield select(getAuthState);
	const originalUserId = yield select(getUserId);

	yield put(receiveLogoutSuccess(freshAuthContext));
	yield put(forgetEntity(userModelName, originalUserId));
}

export function* authFlow() {
	// get initial state from ApiService
	const ApiService = yield select(getApiService);
	const initialStateAuthContext = yield select(getAuthContext);
	const initialAuthContext = yield call(ApiService.getInitialAuthContext, initialStateAuthContext);
	yield put(initialize(initialAuthContext));

	yield call(refreshIdentityTask);

	const freshAuthContext = yield select(getAuthContext);
	yield put(initializeFinish(freshAuthContext));

	while (true) { // eslint-disable-line no-constant-condition
		let loginTaskInstance = null;
		let logoutTaskInstance;
		const action = yield take([LOGIN, LOGOUT, RECEIVE_LOGIN_FAILURE, RECEIVE_IDENTITY]);
		switch (action.type) {
			case LOGIN:
				loginTaskInstance = yield fork(loginTask, action.payload);
				if (logoutTaskInstance) {
					yield cancel(logoutTaskInstance);
				}
				break;
			case LOGOUT:
				if (loginTaskInstance) {
					yield cancel(loginTaskInstance);
				}
				logoutTaskInstance = yield call(logoutTask);
				break;
			default:
				break;
		}
	}
}

export default [
	authFlow,
	watchRefreshIdentity,
];
