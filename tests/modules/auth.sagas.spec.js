import test from 'tape';

import { call, put, select } from 'redux-saga/effects';
import {getApiContext, getApiService} from '../../src/modules/api/selectors';
import {getUser, getAuthContext} from '../../src/modules/auth/selectors';
import { sagas, actions } from '../../src/modules/auth';

var apiMock = {
	login: (credentials, apiContext, authContext) => {
	},
	logout: (apiContext, authContext) => {
	}
};

test('modules/auth/sagas:authorize test - login success', (t) => {

	const saga = sagas.authorize({}, {}, {});

	t.deepEqual(saga.next().value, select(getApiService), 'authorize Saga must select ApiService');
	t.deepEqual(saga.next(apiMock).value, call(apiMock.login, {}, {}, {}), 'authorize Saga must call ApiService.login');

	var loginResult = {user: {}};

	t.deepEqual(saga.next(loginResult).value, put(actions.loginSuccess(loginResult)), 'authorize Saga must put LOGIN_SUCCESS action after successful login');

	t.end();
});

test('modules/auth/sagas:authorize test - login failure', (t) => {

	const saga = sagas.authorize({}, {}, {});

	t.deepEqual(saga.next().value, select(getApiService), 'authorize Saga must select ApiService');
	t.deepEqual(saga.next(apiMock).value, call(apiMock.login, {}, {}, {}), 'authorize Saga must call ApiService.login');

	var loginResult = {message: 'Login failed.'};

	t.deepEqual(saga.throw(loginResult).value, put(actions.loginFailure({message: 'Login failed.'})), 'authorize Saga must put LOGIN_FAILURE action in case of login failure');

	t.end();
});

test('modules/auth/sagas:authorize test - logout success', (t) => {

	const saga = sagas.logout();

	t.deepEqual(saga.next().value, select(getApiService), 'authorize Saga must select ApiService');
	t.deepEqual(saga.next(apiMock).value, select(getAuthContext), 'authorize Saga must select authContext');
	t.deepEqual(saga.next({}).value, select(getApiContext), 'authorize Saga must select apiContext');
	t.deepEqual(saga.next({}).value, call(apiMock.logout, {}, {}), 'authorize Saga must call ApiService.logout');

	t.deepEqual(saga.next({}).value, put(actions.logoutSuccess()), 'authorize Saga must put LOGOUT_SUCCESS action after successful logout');

	t.end();
});
