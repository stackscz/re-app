/* eslint-disable arrow-body-style */

import createReducer from 'utils/createReducer';
import Immutable from 'seamless-immutable';
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
		[LOGIN_SUCCESS]: (state, action) => {
			return state.merge({
				...action.payload,
				authenticating: false,
			});
		},
		[LOGIN_FAILURE]: (state, action) => {
			const { errors } = action.payload;
			return state.merge({
				errors,
				authenticating: false,
			});
		},
		[LOGOUT_SUCCESS]: (state, action) => {
			return state.merge({
				...action.payload,
				user: null,
			});
		},
	}
);
