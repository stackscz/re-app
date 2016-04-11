import { createReducer } from 're-app/utils';

import { INITIALIZE, LOGIN, LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGIN_FAILURE } from './actions';

export default createReducer(
	{
		user: null,
		errors: []
	},
	{
		[LOGIN]: (state, action) => {
			return {...state, errors: []};
		},
		[INITIALIZE]: (state, action) => {
			return {...state, ...action.payload};
		},
		[LOGIN_SUCCESS]: (state, action) => {
			return {...state, ...action.payload, user: action.payload.user};
		},
		[LOGOUT_SUCCESS]: (state) => {
			return {...state, user: null};
		},
		[LOGIN_FAILURE]: (state, action) => {
			const { errors } = action.payload;
			return {...state, errors};
		}
	}
);
