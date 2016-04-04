import { createReducer } from 're-app/utils';

import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS } from './actions';

export default createReducer({
	oauthClientCredentials: {
		grant_type: null,
		client_id: null,
		scope: null
	},
	accessToken: null,
	user: null,
	authenticating: false
}, {
	[LOGIN]: (state) => {
		return {...state, authenticating: true};
	},
	[LOGIN_SUCCESS]: (state, action) => {
		return {...state, user: action.payload.user, accessToken: action.payload.accessToken, authenticating: false};
	},
	[LOGIN_FAILURE]: (state) => {
		return {...state, authenticating: false};
	},
	[LOGOUT_SUCCESS]: (state) => {
		return {...state, accessToken: null, user: null, authenticating: false};
	}
});
