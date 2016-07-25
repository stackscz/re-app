// @flow
/* eslint-disable arrow-body-style */

import createReducer from 'utils/createReducer';
import Immutable from 'seamless-immutable';
import t from 'tcomb';
import type { Error } from 'types/Error';
import type { AuthContext } from 'types/AuthContext';

import {
	INITIALIZE,
	INITIALIZE_FINISH,
	LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT_SUCCESS,
} from './actions';

export default createReducer(
	AuthContext,
	Immutable.from({
		user: null,
		error: null,
		initializing: false,
		initialized: false,
		authenticating: false,
	}),
	{
		[INITIALIZE]: (state, action) => {
			return state.merge({
				...action.payload,
				initializing: true,
			});
		},
		[INITIALIZE_FINISH]: (state, action) => {
			return state.merge({
				...action.payload,
				initializing: false,
				initialized: true,
			});
		},
		[LOGIN]: (state) => {
			if (state.user) {
				return state;
			}
			return state.merge({
				error: null,
				authenticating: true,
			});
		},
		[LOGIN_SUCCESS]: [
			t.struct({
				user: t.Object,
			}),
			(state, action) => {
				const { user } = action.payload;
				return state.merge({
					user,
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
				return state.merge({ authenticating: false, error });
			},
		],
		[LOGOUT_SUCCESS]: (state, action) => {
			return state.merge({
				...action.payload,
				user: null,
			});
		},
	},
	'auth'
);
