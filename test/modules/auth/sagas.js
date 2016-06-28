/* eslint-disable */

import expect from 'expect';

import { call, put, select } from 'redux-saga/effects';
import {getApiContext, getApiService} from 'modules/api/selectors';
import {getUser, getAuthContext} from 'modules/auth/selectors';
import { sagas, actions } from 'modules/auth';

var apiMock = {
	login: (credentials, apiContext, authContext) => {
	},
	logout: (apiContext, authContext) => {
	}
};

describe('modules/auth/sagas:authorize test - login success', (t) => {

	const saga = sagas.authorize({}, {}, {});

	it('should select ApiService', () => {
		expect(saga.next().value).toEqual(select(getApiService));
	});

	it('should call ApiService.login', () => {
		expect(saga.next(apiMock).value).toEqual(call(apiMock.login, {}, {}, {}));
	});

	it('should put LOGIN_SUCCESS action after successful login', () => {
		var loginResult = { user: {} };
		expect(saga.next(loginResult).value).toEqual(put(actions.loginSuccess(loginResult)));
	});

});

describe('modules/auth/sagas:authorize test - login failure', () => {
	const saga = sagas.authorize({}, {}, {});

	it('authorize Saga must select ApiService', () => {
		expect(saga.next().value).toEqual(select(getApiService));
	});
	it('authorize Saga must call ApiService.login', () => {
		expect(saga.next(apiMock).value).toEqual(call(apiMock.login, {}, {}, {}));
	});

	var loginResult = {
		code: 400,
		message: 'Login failed.'
	};

	it('authorize Saga must put LOGIN_FAILURE action in case of login failure', () => {
		expect(saga.throw(loginResult).value).toEqual(put(actions.loginFailure(loginResult)));
	});

});

describe('modules/auth/sagas:authorize test - logout success', () => {
	const saga = sagas.logout();

	it('authorize Saga must select ApiService', () => {
		expect(saga.next().value).toEqual(select(getApiService));
	});
	it('authorize Saga must select authContext', () => {
		expect(saga.next(apiMock).value).toEqual(select(getAuthContext));
	});
	it('authorize Saga must select apiContext', () => {
		expect(saga.next({}).value).toEqual(select(getApiContext));
	});
	it('authorize Saga must call ApiService.logout', () => {
		expect(saga.next({}).value).toEqual(call(apiMock.logout, {}, {}));
	});
	it('authorize Saga must put LOGOUT_SUCCESS action after successful logout', () => {
		expect(saga.next({}).value).toEqual(put(actions.logoutSuccess()));
	});
});
