// @flow
import t, { $Refinement } from 'tcomb';
import type AuthContext from 'types/AuthContext';

const isUnauthenticated = (authContext) => t.Nil.is(authContext.user);
export type UnauthenticatedAuthContext = AuthContext & $Refinement<typeof isUnauthenticated>;
