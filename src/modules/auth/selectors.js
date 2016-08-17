import _ from 'lodash';

export const getAuthState = state => state.auth;
export const getAuthContext = state => _.get(state, 'auth.context', {});

// import {
// 	getModelIdPropertyName,
// } from 'modules/entityDescriptors/selectors';
import {
	getDenormalizedEntitySelector,
} from 'modules/entityStorage/selectors';

export const getUser = state =>
	getDenormalizedEntitySelector(
		state.auth.userModelName,
		state.auth.userId
	)(state);

export const getUserId = state => state.auth.userId;
export const getAuthError = state => state.auth.error;
