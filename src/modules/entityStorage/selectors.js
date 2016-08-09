import _ from 'lodash';
import hash from 'object-hash';
import { getEntityDefinitions } from 'modules/entityDescriptors/selectors';
import denormalize from 'modules/entityDescriptors/utils/denormalize';

export const getEntitySelector = (modelName, id) => (state) => {
	const collection = state.entityStorage.collections[modelName];
	if (!collection) {
		return undefined;
	}
	return collection[id];
};

export const getEntityIdByRef = (modelName, where) =>
	(state) =>
		_.get(state.entityStorage, ['refs', modelName, hash(where), 'entityId']);

export const getDenormalizedEntitySelector = (modelName, entityId, maxLevel = 1) =>
	(state) => {
		const entityDictionary = state.entityStorage.collections;
		const entity = _.get(entityDictionary, [modelName, entityId]);
		if (!modelName || !entityId || !entity) {
			return undefined;
		}
		return denormalize(
			entityId,
			{
				$ref: `#/definitions/${modelName}`,
				definitions: getEntityDefinitions(state),
			},
			entityDictionary,
			maxLevel
		);
	};

export const getDenormalizedEntitiesSelector = (modelName, entities, maxLevel = 1) =>
	(state) => {
		if (!entities) {
			return undefined;
		}
		return denormalize(
			entities,
			{
				type: 'array',
				items: {
					$ref: `#/definitions/${modelName}`,
				},
				definitions: getEntityDefinitions(state),
			},
			state.entityStorage.collections,
			maxLevel
		);
	};

export const getEntityStatusSelector = (modelName, entityId) =>
	(state) => _.get(state.entityStorage, ['statuses', modelName, entityId]);

export const getEntityErrorSelector = (modelName, entityId) =>
	(state) => _.get(state.entityStorage, ['errors', modelName, entityId]);
