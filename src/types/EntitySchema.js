// @flow
import { $Refinement } from 'tcomb';
import type { EntityFieldSchema } from 'types/EntityFieldSchema';

const hasDisplayProperty = (definition) =>
	!!definition.properties[definition['x-displayPropertyName']];

const hasIdProperty = (definition) =>
	!!definition.properties[definition['x-idPropertyName']];

export type EntitySchema = Object & {
	// 'x-idPropertyName': string,
	// 'x-displayPropertyName': string,
	properties: {
		[key: string]: EntityFieldSchema
	},
} & $Refinement<typeof hasDisplayProperty> & $Refinement<typeof hasIdProperty>
