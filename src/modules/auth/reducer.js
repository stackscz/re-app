/* eslint-disable arrow-body-style */

import createReducer from 'utils/createReducer';
import Immutable from 'seamless-immutable';
import t from 'tcomb';
import { AuthContext } from './types';

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
		errors: [],
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
				errors: [],
				authenticating: true,
			});
		},
		[LOGIN_SUCCESS]: [
			t.struct({
				user: t.Object,
			}),
			(state, action) => {
				return state.merge({
					...action.payload,
					authenticating: false,
				});
			},
		],
		[LOGIN_FAILURE]: [
			t.struct({
				error: t.Object,
			}),
			(state, action) => {
				const { error } = action.payload;
				return state
					.update('errors', (errors, newError) => errors.concat([newError]), error)
					.merge({ authenticating: false });
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
