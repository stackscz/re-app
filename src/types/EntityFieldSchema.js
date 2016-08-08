// @flow
export type EntityFieldSchema = {
	type: string,
	$ref: void,
} | {
	type: void,
	$ref: string
};
