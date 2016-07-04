// @flow
import type EntityId from 'types/EntityId';
import type NormalizedEntity from 'types/NormalizedEntity';
export type NormalizedEntityDictionary = {
	[key: EntityId]: NormalizedEntity,
};
