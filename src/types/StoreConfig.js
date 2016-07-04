// @flow
export type StoreConfig = {
	logging?: boolean,
	reducers?: Object,
	sagas?: Array<Function>,
	enhancers?: Array<Function>,
};
