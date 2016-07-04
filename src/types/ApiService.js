// @flow
export type ApiService = {
	getInitialAuthContext(): void;
	initializeAuth(): void;
	login(): void;
	logout(): void;
	getEntityDescriptors(): void;
	getEntityIndex(): void;
	getEntity(): void;
	createEntity(): void;
	updateEntity(): void;
	deleteEntity(): void;
}
