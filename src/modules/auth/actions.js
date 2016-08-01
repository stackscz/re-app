export const INITIALIZE = 're-app/auth/INITIALIZE';
export function initialize(context) {
	return { type: INITIALIZE, payload: context };
}

export const INITIALIZE_FINISH = 're-app/auth/INITIALIZE_FINISH';
export function initializeFinish(context, userId) {
	return { type: INITIALIZE_FINISH, payload: { context, userId } };
}

export const LOGIN = 're-app/auth/LOGIN';
export function login(credentials) {
	return { type: LOGIN, payload: credentials };
}

export const LOGIN_SUCCESS = 're-app/auth/LOGIN_SUCCESS';
export function loginSuccess(userId, context) {
	return { type: LOGIN_SUCCESS, payload: { userId, context } };
}

export const LOGIN_FAILURE = 're-app/auth/LOGIN_FAILURE';
export function loginFailure(error) {
	return { type: LOGIN_FAILURE, payload: { error } };
}

export const LOGOUT = 're-app/auth/LOGOUT';
export function logout() {
	return { type: LOGOUT };
}

export const LOGOUT_SUCCESS = 're-app/auth/LOGOUT_SUCCESS';
export function logoutSuccess(context) {
	return { type: LOGOUT_SUCCESS, payload: { context } };
}

export const LOGOUT_FAILURE = 're-app/auth/LOGOUT_FAILURE';
export function logoutFailure(error) {
	return { type: LOGOUT_FAILURE, payload: { error } };
}
