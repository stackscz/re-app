// @flow
export type AuthContext = {
	user?: Object,
	errors: Array<Object>,
	initializing: boolean,
	initialized: boolean,
	authenticating: boolean,
}
