// @flow
/* eslint-disable */

import expect from 'expect';

import { call, put, select } from 'redux-saga/effects';
import {getApiContext, getApiService} from 'modules/api/selectors';
import {getUser, getAuthContext} from 'modules/auth/selectors';
import { sagas, actions } from 'modules/auth';

import ApiServiceImpl from 'mocks/ApiService';
import type { ApiService } from 'types/ApiService';

const apiContext = {
	service: ApiServiceImpl,
};

const authContext = {
	errors: [],
	initializing: true,
	initialized: false,
	authenticating: false,
};

describe('modules/auth/sagas:authorize test - login success', (t) => {

	const saga = sagas.authorize({}, apiContext, authContext);

	it('should select ApiService', () => {
		expect(saga.next().value).toEqual(select(getApiService));
	});

	it('should call ApiService.login', () => {
		expect(saga.next(ApiServiceImpl).value).toEqual(call(ApiServiceImpl.login, {}, apiContext, authContext));
	});

	it('should put LOGIN_SUCCESS action after successful login', () => {
		var loginResult = { user: {} };
		expect(saga.next(loginResult).value).toEqual(put(actions.loginSuccess({})));
	});

});

describe('modules/auth/sagas:authorize test - login failure', () => {

	const saga = sagas.authorize({}, apiContext, authContext);

	it('authorize Saga must select ApiService', () => {
		expect(saga.next().value).toEqual(select(getApiService));
	});
	it('authorize Saga must call ApiService.login', () => {
		expect(saga.next(ApiServiceImpl).value).toEqual(call(ApiServiceImpl.login, {}, apiContext, authContext));
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
		expect(saga.next(ApiServiceImpl).value).toEqual(select(getAuthContext));
	});
	it('authorize Saga must select apiContext', () => {
		expect(saga.next({}).value).toEqual(select(getApiContext));
	});
	it('authorize Saga must call ApiService.logout', () => {
		expect(saga.next({}).value).toEqual(call(ApiServiceImpl.logout, {}, {}));
	});
	it('authorize Saga must put LOGOUT_SUCCESS action after successful logout', () => {
		expect(saga.next({}).value).toEqual(put(actions.logoutSuccess()));
	});
});
