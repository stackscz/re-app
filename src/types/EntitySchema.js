// @flow
// import { $Refinement } from 'tcomb';
// import type { EntityPropertySchema } from 'types/EntityPropertySchema';

// const hasDisplayProperty = (definition) =>
// 	!!definition.properties[definition['x-displayPropertyName']];
//
// const hasIdProperty = (definition) =>
// 	!!definition.properties[definition['x-idPropertyName']];

// recursive
export type EntitySchema = Object & {
	// 'x-idPropertyName': string,
	// 'x-displayPropertyName': string,
	properties?: {
		[key: string]: EntitySchema
	},
};
// & $Refinement<typeof hasDisplayProperty> & $Refinement<typeof hasIdProperty>
