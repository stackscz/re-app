// @flow
import _ from 'lodash';
import { $Refinement } from 'tcomb';
import type EntitySchema from 'types/EntitySchema';

const isDictionary = (dictionary) => _.every(dictionary, (item, key) => item.name === key);
export type SchemasDictionary = Object & {
	[key: string]: EntitySchema,
} & $Refinement<typeof isDictionary>;
