// @flow
import type { EntitySchema } from 'types/EntitySchema';
export type EntityPropertySchema = {
	type?: string,
	$ref?: string,
	allOf?: Array<EntitySchema>,
};
