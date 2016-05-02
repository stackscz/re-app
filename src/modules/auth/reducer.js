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
		[INITIALIZE]: (state, action) => {
			return {...state, ...action.payload, initializing: true};
		},
		[INITIALIZE_FINISH]: (state, action) => {
			return {...state, ...action.payload, initializing: false, initialized: true};
		},
		[LOGIN]: (state) => {
			if (state.user) {
				return state;
			}
			return {...state, errors: [], authenticating: true};
		},
		[LOGIN_SUCCESS]: (state, action) => {
			return {...state, ...action.payload, authenticating: false};
		},
		[LOGIN_FAILURE]: (state, action) => {
			const { errors } = action.payload;
			return {...state, errors, authenticating: false};
		},
		[LOGOUT_SUCCESS]: (state, action) => {
			return {...state, ...action.payload, user: null};
		}
	}
);
