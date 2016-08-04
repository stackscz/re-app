// @flow
/* eslint-disable arrow-body-style */

import createReducer from 'utils/createReducer';
import Immutable from 'seamless-immutable';
import t from 'tcomb';
import type { Error } from 'types/Error';
import type { EntityId } from 'types/EntityId';
import type { AuthContext } from 'types/AuthContext';
import type { AuthModuleState } from 'types/AuthModuleState';

import {
	INITIALIZE,
	INITIALIZE_FINISH,
	RECEIVE_IDENTITY,
	LOGIN,
	RECEIVE_LOGIN_SUCCESS,
	RECEIVE_LOGIN_FAILURE,
	RECEIVE_LOGOUT_SUCCESS,
	RECEIVE_LOGOUT_FAILURE,
} from './actions';

export default createReducer(
	AuthModuleState,
	Immutable.from({
		context: {},
		userId: null,
		userModelName: 'users',
		error: null,
		initializing: false,
		initialized: false,
		authenticating: false,
	}),
	{
		[INITIALIZE]: [
			t.struct({
				context: AuthContext,
			}),
			(state, action) => {
				const { context } = action.payload;
				return state.merge({
					context,
					initializing: true,
				});
			},
		],
		[INITIALIZE_FINISH]: [
			t.struct({
				context: AuthContext,
			}),
			(state, action) => {
				const { context } = action.payload;
				return state.merge({
					context,
					initializing: false,
					initialized: true,
				});
			},
		],
		[RECEIVE_IDENTITY]: [
			t.struct({
				userId: t.maybe(EntityId),
				context: AuthContext,
			}),
			(state, action) => {
				const { userId, context } = action.payload;
				return state.merge({
					userId,
					context,
				});
			},
		],
		[LOGIN]: (state) => {
			return state.merge({
				error: null,
				authenticating: true,
			});
		},
		[RECEIVE_LOGIN_SUCCESS]: [
			t.struct({
				userId: EntityId,
				context: AuthContext,
			}),
			(state, action) => {
				const { userId, context } = action.payload;
				return state.merge({
					userId,
					context,
					authenticating: false,
				});
			},
		],
		[RECEIVE_LOGIN_FAILURE]: [
			t.struct({
				error: Error,
			}),
			(state, action) => {
				const { error } = action.payload;
				return state.merge({
					error,
					authenticating: false,
				});
			},
		],
		[RECEIVE_LOGOUT_SUCCESS]: [
			t.struct({
				context: AuthContext,
			}),
			(state, action) => {
				const { context } = action.payload;
				return state.merge({
					context,
					userId: null,
					error: null,
				});
			},
		],
		[RECEIVE_LOGOUT_FAILURE]: [
			t.struct({
				error: Error,
			}),
			(state, action) => {
				const { error } = action.payload;
				return state.merge({
					error,
				});
			},
		],
	},
	'auth'
);
