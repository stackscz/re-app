// @flow
import t, { $Refinement } from 'tcomb';
import type { AuthContext } from 'types/AuthContext';

const isAuthenticated = (authContext) => t.Object.is(authContext.user);
export type AuthenticatedAuthContext = AuthContext & $Refinement<typeof isAuthenticated>;
