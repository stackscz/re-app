// @flow
import type { Error } from 'types/Error';
import type { EntityId } from 'types/EntityId';
export type AuthModuleState = {
	context: Object,
	userId?: EntityId,
	userModelName: string,
	error?: Error,
	initializing: boolean,
	initialized: boolean,
	authenticating: boolean,
}
