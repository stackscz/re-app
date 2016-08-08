// @flow
import type { EntitySchema } from 'types/EntitySchema';

export type DefinitionsDictionary = Object & {
	[key: string]: EntitySchema
};
