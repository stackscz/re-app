import t from 'tcomb';

export const ApiService = t.struct({
	getInitialAuthContext: t.Function,
	initializeAuth: t.Function,
	login: t.Function,
	logout: t.Function,
	getEntityDescriptors: t.Function,
	getEntityIndex: t.Function,
	getEntity: t.Function,
	createEntity: t.Function,
	updateEntity: t.Function,
	deleteEntity: t.Function
});

export const ApiContext = t.struct({
	host: t.maybe(t.struct({
		name: t.String,
		ssl: t.Boolean
	})),
	service: ApiService
});
