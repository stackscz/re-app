// @flow
import type { CollectionName } from 'types/CollectionName';
import type { EntityId } from 'types/EntityId';
import type { NormalizedEntity } from 'types/NormalizedEntity';
export type NormalizedEntityDictionary = {
	[key: CollectionName]:{
		[key: EntityId]: NormalizedEntity
	},
};
