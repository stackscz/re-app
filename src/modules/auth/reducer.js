import { createCheckedReducer } from 're-app/utils';
import { t } from 'redux-tcomb';

import {
	INITIALIZE,
	INITIALIZE_FINISH,
	LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT_SUCCESS
} from './actions';

export default createCheckedReducer(
	t.struct({
		user: t.maybe(t.Object),
		errors: t.list(t.Object),
		initializing: t.Boolean,
		initialized: t.Boolean,
		authenticating: t.Boolean
	}),
	{
		user: null,
		errors: [],
		initializing: false,
		initialized: false,
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
