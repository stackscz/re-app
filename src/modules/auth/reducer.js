import { createReducer } from 're-app/utils';

import { INITIALIZE, LOGIN_SUCCESS, LOGOUT_SUCCESS } from './actions';

export default createReducer(
	{
		user: null
	},
	{
		[INITIALIZE]: (state, action) => {
			return {...state, ...action.payload};
		},
		[LOGIN_SUCCESS]: (state, action) => {
			return {...state, ...action.payload, user: action.payload.user};
		},
		[LOGOUT_SUCCESS]: (state) => {
			return {...state, user: null};
		}
	}
);
