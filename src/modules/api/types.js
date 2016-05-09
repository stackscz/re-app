import t from 'tcomb';

const ApiService = t.struct({
	getInitialAuthContext: t.Function,
	initializeAuth: t.Function,
	login: t.Function,
	logout: t.Function,
	getEntityDescriptors: t.Function,
	getEntityIndex: t.Function,
	getEntity: t.Function,
	persistEntity: t.Function,
	deleteEntity: t.Function
});

export const ApiContext = t.struct({
	host: t.maybe(t.struct({
		name: t.String,
		ssl: t.Boolean
	})),
	service: ApiService
});
