// @flow
import { take, fork, call, put, select, cancel } from 'redux-saga/effects';

import t from 'tcomb';
import moment from 'moment';
import type { ApiContext } from 'types/ApiContext';
import type { AuthContext } from 'types/AuthContext';
import type { Error } from 'types/Error';

import rethrowError from 'utils/rethrowError';
// import apiServiceResultTypeInvariant from 'utils/apiServiceResultTypeInvariant';
import isOfType from 'utils/isOfType';

import { getApiContext, getApiService } from 'modules/api/selectors';
import { getEntitySchemas } from 'modules/entityDescriptors/selectors';

import normalize from 'modules/entityDescriptors/utils/normalize';

import {
	receiveEntities,
	forgetEntity,
} from 'modules/entityStorage/actions';

import { getAuthState, getAuthContext } from './selectors';
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

export function* loginTask(credentials, apiContext:ApiContext, authContext:AuthContext) {
	const apiService = yield select(getApiService);
	let apiCallResult;
	let user;
	let freshAuthContext = authContext;
	try {
		apiCallResult = yield call(apiService.login, credentials, apiContext, authContext);
		user = apiCallResult.user;
		freshAuthContext = apiCallResult.authContext;
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

	if (!isOfType(user, t.Object)) {
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

	const { userModelName } = yield select(getAuthState);
	const entitySchemas = yield select(getEntitySchemas);
	const {
		result: userId,
		entities,
	} = normalize(user, userModelName, entitySchemas);
	yield put(receiveEntities(entities, moment().format()));
	yield put(loginSuccess(userId, freshAuthContext));
}

export function* logoutTask() {
	const apiService = yield select(getApiService);
	const authContext = yield select(getAuthContext);
	const {
		userModelName,
		userId,
	} = yield select(getAuthState);
	const apiContext = yield select(getApiContext);
	try {
		const freshAuthContext = yield call(apiService.logout, apiContext, authContext);
		yield put(forgetEntity(userModelName, userId));
		yield put(logoutSuccess(freshAuthContext));
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
	const apiContext = yield select(getApiContext);
	const initialStateAuthContext = yield select(getAuthContext);
	const initialAuthContext = yield call(ApiService.getInitialAuthContext, initialStateAuthContext);
	yield put(initialize({ context: initialAuthContext }));
	let refreshAuthResult;
	try {
		refreshAuthResult = yield call(
			ApiService.refreshAuth,
			apiContext,
			initialAuthContext
		);
	} catch (error) {
		rethrowError(error);
		// TODO put error action
		console.error('refreshAuth should always resolve');
		return;
	}
	const { user, authContext: freshAuthContext } = refreshAuthResult;
	if (!isOfType(freshAuthContext, AuthContext)) {
		// TODO put error action
		console.error('refreshAuth returned invalid authContext');
		return;
	}
	if (user) {
		const { userModelName } = yield select(getAuthState);
		const entitySchemas = yield select(getEntitySchemas);
		try {
			const {
				result: userId,
				entities,
			} = normalize(user, userModelName, entitySchemas);
			yield put(receiveEntities(entities, moment().format()));
			yield put(initializeFinish(freshAuthContext, userId));
		} catch (error) {
			// TODO put error action
			console.error('Could not normalize user.');
			return;
		}
	} else {
		yield put(initializeFinish(freshAuthContext));
	}


	while (true) { // eslint-disable-line no-constant-condition
		let loginTaskInstance = null;
		let logoutTaskInstance;
		const authContext = yield select(getAuthContext);
		const action = yield take([LOGIN, LOGOUT, LOGIN_FAILURE, LOGIN_SUCCESS]);
		switch (action.type) {
			case LOGIN:
				loginTaskInstance = yield fork(loginTask, action.payload, apiContext, authContext);
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

export default [authFlow];
