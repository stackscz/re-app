// @flow
import _ from 'lodash';
import { $Refinement } from 'tcomb';
import type { EntityFieldSchema } from 'types/EntityFieldSchema';

const hasDisplayField = (schema) => !!schema.fields[schema.displayFieldName];
const hasIdField = (schema) => !!schema.fields[schema.idFieldName];
const isDictionary = (dictionary) => _.every(dictionary, (item, key) => item.name === key);
export type EntitySchema = Object & { // TODO migrate to model arch.
	name: string,
	idFieldName: string,
	displayFieldName: string,
	isFilterable: boolean,
	fields: {
		[key: string]: EntityFieldSchema
	} & $Refinement<typeof isDictionary>,
} & $Refinement<typeof hasDisplayField> & $Refinement<typeof hasIdField>
