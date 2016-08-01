// @flow
export type ApiService = {
	getInitialAuthContext(): void;
	refreshAuth(): void;
	login(): void;
	logout(): void;
	getEntityDescriptors(): void;
	getEntityIndex(): void;
	getEntity(): void;
	createEntity(): void;
	updateEntity(): void;
	deleteEntity(): void;
}
