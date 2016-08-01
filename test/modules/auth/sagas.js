// @flow
/* eslint-disable */

import expect from 'expect';
import moment from 'moment';

import { call, put, select } from 'redux-saga/effects';
import { getApiContext, getApiService } from 'modules/api/selectors';
import {
	getUser,
	getAuthContext,
	getAuthState,
} from 'modules/auth/selectors';
import { getEntitySchemas } from 'modules/entityDescriptors/selectors';
import { sagas, actions } from 'modules/auth';
import {
	loginSuccess,
} from 'modules/auth/actions';
import {
	forgetEntity,
	receiveEntities,
} from 'modules/entityStorage/actions';

import ApiServiceImpl from 'mocks/ApiService';

import entityDescriptors from 'mocks/entityDescriptors';

const apiContext = {
	service: ApiServiceImpl,
};

const authState = {
	context: {},
	userModelName: 'users',
	error: null,
	initializing: true,
	initialized: false,
	authenticating: false,
};

describe('modules/auth/sagas:authorize test - login success', (t) => {


	it('should work', () => {
		const saga = sagas.loginTask({}, apiContext, authState.context);
		let next = saga.next();

		expect(next.value).toEqual(select(getApiService));
		next = saga.next(ApiServiceImpl);

		expect(next.value).toEqual(call(ApiServiceImpl.login, {}, apiContext, authState.context));
		next = saga.next({ user: { username: 'username' }, authContext: {} });

		expect(next.value).toEqual(select(getAuthState));
		next = saga.next(authState);

		expect(next.value).toEqual(select(getEntitySchemas));
		next = saga.next(entityDescriptors.schemas);

		const normalizedEntities = {
			users: {
				username: {
					username: 'username'
				}
			}
		};
		expect(next.value).toEqual(put(receiveEntities(normalizedEntities, moment().format())));
		next = saga.next();

		expect(next.value).toEqual(put(loginSuccess('username', authState.context)));
		next = saga.next();

	});

});

describe('modules/auth/sagas:loginTask test - login failure', () => {

	const saga = sagas.loginTask({}, apiContext, authState);

	it('authorize Saga must select ApiService', () => {
		expect(saga.next().value).toEqual(select(getApiService));
	});
	it('authorize Saga must call ApiService.login', () => {
		expect(saga.next(ApiServiceImpl).value).toEqual(call(ApiServiceImpl.login, {}, apiContext, authState));
	});

	var loginResult = {
		code: 400,
		message: 'Login failed.'
	};

	it('authorize Saga must put LOGIN_FAILURE action in case of login failure', () => {
		expect(saga.throw(loginResult).value).toEqual(put(actions.loginFailure(loginResult)));
	});

});

describe('modules/auth/sagas:logoutTask test - logout success', () => {
	const saga = sagas.logoutTask();

	let next = saga.next();
	it('authorize Saga must select ApiService', () => {
		expect(next.value).toEqual(select(getApiService));
		next = saga.next(ApiServiceImpl);
	});
	it('authorize Saga must select authState', () => {
		expect(next.value).toEqual(select(getAuthContext));
		next = saga.next({});
	});
	it('authorize Saga must select authState', () => {
		expect(next.value).toEqual(select(getAuthState));
		next = saga.next(authState.context);
	});
	it('authorize Saga must select apiContext', () => {
		expect(next.value).toEqual(select(getApiContext));
		next = saga.next(apiContext);
	});
	it('authorize Saga must call ApiService.logout', () => {
		expect(next.value).toEqual(call(ApiServiceImpl.logout, apiContext, authState.context));
		next = saga.next(authState.context);
	});
	it('authorize Saga must put FORGET_ENTITY action after successful logout', () => {
		expect(next.value).toEqual(put(forgetEntity()));
		next = saga.next();
	});
	it('authorize Saga must put LOGOUT_SUCCESS action after successful logout', () => {
		expect(next.value).toEqual(put(actions.logoutSuccess(authState.context)));
	});
});
