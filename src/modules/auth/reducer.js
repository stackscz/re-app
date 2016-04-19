import { createReducer } from 're-app/utils';

import {
	INITIALIZE,
	INITIALIZE_FINISH,
	LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT_SUCCESS
} from './actions';

export default createReducer(
	{
		user: null,
		errors: [],
		initializing: false,
		authenticating: false
	},
	{
		[INITIALIZE]: (state) => {
			return {...state, initializing: true};
		},
		[INITIALIZE_FINISH]: (state, action) => {
			return {...state, ...action.payload, initializing: false};
		},
		[LOGIN]: (state) => {
			return {...state, errors: [], authenticating: true};
		},
		[LOGIN_SUCCESS]: (state, action) => {
			const { user } = action.payload;
			return {...state, user, authenticating: false};
		},
		[LOGIN_FAILURE]: (state, action) => {
			const { errors } = action.payload;
			return {...state, errors, authenticating: false};
		},
		[LOGOUT_SUCCESS]: (state) => {
			return {...state, user: null};
		}
	}
);
