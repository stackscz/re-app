// @flow
import t from 'tcomb';
import type { Error } from 'types/Error';
export const AuthError = Error;

export const AuthContext = t.struct({
	user: t.maybe(t.Object),
	errors: t.list(t.Object),
	initializing: t.Boolean,
	initialized: t.Boolean,
	authenticating: t.Boolean,
}, 'AuthContext');

export const AuthenticatedAuthContext = t.refinement(
	AuthContext,
	(context) => t.Object.is(context.user),
	'AuthenticatedAuthContext'
);

export const UnauthenticatedAuthContext = t.refinement(
	AuthContext,
	(context) => t.Nil.is(context.user),
	'UnauthenticatedAuthContext'
);
