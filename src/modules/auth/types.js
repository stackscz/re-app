import t from 'tcomb';

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

export const AuthError = t.Object;
