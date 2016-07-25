// @flow
import type { Error } from 'types/Error';
export type AuthContext = {
	user?: Object,
	error?: Error,
	initializing: boolean,
	initialized: boolean,
	authenticating: boolean,
}
