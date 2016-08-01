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
	LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT_SUCCESS,
	LOGOUT_FAILURE,
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
				userId: t.maybe(EntityId),
			}),
			(state, action) => {
				const { context, userId } = action.payload;
				return state.merge({
					context,
					userId,
					initializing: false,
					initialized: true,
				});
			},
		],
		[LOGIN]: (state) => {
			return state.merge({
				error: null,
				authenticating: true,
			});
		},
		[LOGIN_SUCCESS]: [
			t.struct({
				context: AuthContext,
				userId: EntityId,
			}),
			(state, action) => {
				const { context, userId } = action.payload;
				return state.merge({
					context,
					userId,
					authenticating: false,
				});
			},
		],
		[LOGIN_FAILURE]: [
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
		[LOGOUT_SUCCESS]: [
			t.struct({
				context: AuthContext,
			}),
			(state, action) => {
				const { context } = action.payload;
				return state.merge({
					context,
					userId: null,
				});
			},
		],
		[LOGOUT_FAILURE]: [
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
