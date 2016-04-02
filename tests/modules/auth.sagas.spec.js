import test from 'tape';

import { call, put, select } from 'redux-saga/effects';
import {getApiService, getUser, getAuth} from '../../src/modules/auth/selectors';
import { sagas, actions } from '../../src/modules/auth';

var apiMock = {
	login: (credentials) => {
	},
	logout: () => {
	}
}

test('modules/auth/sagas:authorize test - login success', (t) => {

	const saga = sagas.authorize({}, {});

	t.deepEqual(saga.next().value, select(getApiService), 'authorize Saga must select ApiService');
	t.deepEqual(saga.next(apiMock).value, call(apiMock.login, {}, {}), 'authorize Saga must call ApiService.login');

	var loginResult = {user: {}};

	t.deepEqual(saga.next(loginResult).value, put(actions.loginSuccess(loginResult)), 'authorize Saga must put LOGIN_SUCCESS action after successful login');

	t.end();
});

test('modules/auth/sagas:authorize test - login failure', (t) => {

	const saga = sagas.authorize({}, {});

	t.deepEqual(saga.next().value, select(getApiService), 'authorize Saga must select ApiService');
	t.deepEqual(saga.next(apiMock).value, call(apiMock.login, {}, {}), 'authorize Saga must call ApiService.login');

	var loginResult = {error: {message: 'Login failed.'}};

	t.deepEqual(saga.next(loginResult).value, put(actions.loginFailure()), 'authorize Saga must put LOGIN_FAILURE action in case of login failure');

	t.end();
});

test('modules/auth/sagas:authorize test - logout success', (t) => {

	const saga = sagas.logout();

	t.deepEqual(saga.next().value, select(getApiService), 'authorize Saga must select ApiService');
	t.deepEqual(saga.next(apiMock).value, select(getAuth), 'authorize Saga must select getAuth');
	t.deepEqual(saga.next({}).value, call(apiMock.logout, {}), 'authorize Saga must call ApiService.logout');

	t.deepEqual(saga.next().value, put(actions.logoutSuccess()), 'authorize Saga must put LOGOUT_SUCCESS action after successful logout');

	t.end();
});
