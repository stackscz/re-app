// @flow
// recursive
export type JsonSchema = {
	type?: Array<string> | string,
	properties?: {
		[key: string]: JsonSchema
	},
	definitions?: {
		[key: string]: JsonSchema
	}
};
