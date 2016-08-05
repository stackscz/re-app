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
	getUserId,
} from 'modules/auth/selectors';
import { getEntitySchemas } from 'modules/entityDescriptors/selectors';
import { sagas, actions } from 'modules/auth';
import {
	receiveIdentity,
	receiveLoginSuccess,
	receiveLogoutSuccess,
} from 'modules/auth/actions';
import {
	forgetEntity,
	receiveEntities,
} from 'modules/entityStorage/actions';

import ApiServiceImpl from 'mocks/ApiService';

import entityDescriptors from 'mocks/entityDescriptors';

import startSaga from 'utils/test/startSaga';
import nextEffect from 'utils/test/nextEffect';

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

describe('modules/auth/sagas:refreshIdentityTask', (t) => {

	const saga = sagas.refreshIdentityTask();
	let next = startSaga(saga);

	next = nextEffect(
		saga,
		next,
		select(getApiService),
		ApiServiceImpl
	);
	next = nextEffect(
		saga,
		next,
		select(getApiContext),
		{}
	);
	next = nextEffect(
		saga,
		next,
		select(getAuthContext),
		{}
	);
	next = nextEffect(
		saga,
		next,
		call(
			ApiServiceImpl.refreshAuth,
			{},
			{}
		),
		{
			user: {
				username: 'username'
			},
			authContext: {}
		}
	);
	next = nextEffect(
		saga,
		next,
		select(getAuthState),
		{
			userModelName: 'User'
		}
	);
	next = nextEffect(
		saga,
		next,
		select(getUserId),
		'username2'
	);
	next = nextEffect(
		saga,
		next,
		call(
			sagas.normalizeUserTask,
			{
				username: 'username'
			}
		),
		{
			userId: 'username',
			entities: {
				'User': {
					username: 'username'
				}
			}
		}
	);
	next = nextEffect(
		saga,
		next,
		put(
			receiveEntities(
				{
					User: {
						username: 'username'
					}
				},
				moment().format()
			)
		)
	);
	next = nextEffect(
		saga,
		next,
		put(
			receiveIdentity(
				'username',
				{}
			)
		)
	);
	next = nextEffect(
		saga,
		next,
		put(
			forgetEntity(
				'User',
				'username2'
			)
		)
	);

});

describe('modules/auth/sagas:loginTask test - login failure', () => {

	const saga = sagas.loginTask({ username: 'username', password: 'password' });
	let next = startSaga(saga);

	next = nextEffect(
		saga,
		next,
		select(getApiService),
		ApiServiceImpl
	);
	next = nextEffect(
		saga,
		next,
		select(getApiContext),
		{}
	);
	next = nextEffect(
		saga,
		next,
		select(getAuthContext),
		{}
	);
	next = nextEffect(
		saga,
		next,
		call(
			ApiServiceImpl.login,
			{ username: 'username', password: 'password' },
			{},
			{}
		),
		{
			user: {
				username: 'username'
			},
			authContext: {}
		}
	);
	next = nextEffect(
		saga,
		next,
		call(
			sagas.normalizeUserTask,
			{
				username: 'username'
			}
		),
		{
			userId: 'username',
			entities: {
				'User': {
					username: 'username'
				}
			}
		}
	);
	next = nextEffect(
		saga,
		next,
		select(getAuthState),
		{
			userModelName: 'User'
		}
	);
	next = nextEffect(
		saga,
		next,
		select(getUserId),
		'username2'
	);
	next = nextEffect(
		saga,
		next,
		put(
			receiveEntities(
				{
					User: {
						username: 'username'
					}
				},
				moment().format()
			)
		)
	);
	next = nextEffect(
		saga,
		next,
		put(
			receiveLoginSuccess(
				'username',
				{}
			)
		)
	);
	next = nextEffect(
		saga,
		next,
		put(
			forgetEntity(
				'User',
				'username2'
			)
		)
	);

});

describe('modules/auth/sagas:logoutTask test - logout success', () => {

	const saga = sagas.logoutTask();
	let next = startSaga(saga);
	next = nextEffect(
		saga,
		next,
		select(getApiService),
		ApiServiceImpl
	);
	next = nextEffect(
		saga,
		next,
		select(getAuthContext),
		{}
	);
	next = nextEffect(
		saga,
		next,
		select(getApiContext),
		{}
	);
	next = nextEffect(
		saga,
		next,
		call(ApiServiceImpl.logout, {}, {}),
		{}
	);
	next = nextEffect(
		saga,
		next,
		select(getAuthState),
		{ userModelName: 'User' }
	);
	next = nextEffect(
		saga,
		next,
		select(getUserId),
		12345
	);
	next = nextEffect(
		saga,
		next,
		put(receiveLogoutSuccess({}))
	);
	next = nextEffect(
		saga,
		next,
		put(forgetEntity('User', 12345))
	);

});
