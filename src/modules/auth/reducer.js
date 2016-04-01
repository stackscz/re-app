import { createReducer } from 're-app/utils';

import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from './actions';

export default createReducer({
	oauthClientCredentials: {
		grant_type: null,
		client_id: null,
		scope: null
	},
	accessToken: null,
	user: null
}, {
	[LOGIN_SUCCESS]: (state, action) => {
		return {...state, user: action.payload.user, accessToken: action.payload.accessToken};
	},
	[LOGOUT_SUCCESS]: (state) => {
		return {...state, accessToken: null, user: null};
	}
});
