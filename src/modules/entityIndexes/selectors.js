import _, { uniq, concat, get as g } from 'lodash';
import hash from 'object-hash';

import normalizeFilter from './utils/normalizeFilter';
import getComposingModels from 'modules/entityDescriptors/utils/getComposingModels';
import getDependentModels from 'modules/entityDescriptors/utils/getDependentModels';

import type { EntityIndexFilter } from 'types/EntityIndexFilter';

export const getEntityIndexSelector =
	(indexHash:string|{modelName:string, filter: EntityIndexFilter}) =>
		(state) => {
			if (!indexHash) {
				return undefined;
			}
			let finalIndexHash = indexHash;
			if (!_.isString(finalIndexHash)) {
				const { modelName, filter } = indexHash;
				finalIndexHash = hash({ modelName, filter });
			}
			return _.get(state, ['entityIndexes', 'indexes', finalIndexHash]);
		};

/**
 * Selects index.content with transient entities matching `where` key value of filter, sorted
 *
 * @param {string} indexHash
 */
export const getDynamicEntityIndexContentSelector =
	(indexHash:string|{modelName:string, filter: EntityIndexFilter}) =>
		(state) => {
			if (!indexHash) {
				return undefined;
			}
			let finalIndexHash = indexHash;
			if (!_.isString(finalIndexHash)) {
				const { modelName, filter } = indexHash;
				finalIndexHash = hash({ modelName, filter });
			}
			const index = _.get(state, ['entityIndexes', 'indexes', finalIndexHash]);
			if (!index || !index.content) {
				return undefined;
			}
			const compositingModels = getComposingModels(
				g(state, ['entityDescriptors', 'definitions', index.modelName])
			);
			const dependentModels = getDependentModels(
				index.modelName,
				state.entityDescriptors.definitions
			);
			const groupedModels = uniq(concat([index.modelName], dependentModels, compositingModels));

			const normalizedFilter = normalizeFilter(index.filter);
			const indexEntityIdsMap = _.zipObject(index.content, index.content.map(() => true));
			const result = [...index.content];

			let noUnlisted = true;
			let foundCollection = false;
			_.each(groupedModels, (compositingModelName) => {
				const collection = _.get(state, ['entityStorage', 'collections', compositingModelName]);
				if (!collection) {
					return;
				}
				foundCollection = true;
				_.each(collection, (entity, entityId) => {
					const isMatch = _.isMatch(entity, normalizedFilter.where);
					const isUnlisted = !indexEntityIdsMap[entityId];
					if (isMatch && isUnlisted) {
						noUnlisted = false;
						result.push(entityId);
					}
				});
			});
			if (!foundCollection) {
				return index.content;
			}

			if (noUnlisted) {
				return result;
			}

			// return result;

			return _.orderBy(
				uniq(result),
				normalizedFilter.order.map(
					(sortSpec) =>
						(entityId) => _.reduce(groupedModels, (propValue, modelName) => {
							if (propValue) {
								return propValue;
							}
							return _.get(
								state,
								[
									'entityStorage',
									'collections',
									modelName,
									entityId,
									_.trimStart(sortSpec, '-'),
								]
							);
						}, undefined)
				),
				normalizedFilter.order.map(
					(sortSpec) =>
						(_.startsWith(sortSpec, '-') ? 'desc' : 'asc')
				)
			);
		};

export const getDynamicEntityIndexSelector =
	(indexHash:string|{modelName:string, filter: EntityIndexFilter}) =>
		(state) => {
			if (!indexHash) {
				return undefined;
			}
			let finalIndexHash = indexHash;
			if (!_.isString(finalIndexHash)) {
				const { modelName, filter } = indexHash;
				finalIndexHash = hash({ modelName, filter });
			}
			const index = _.get(state, ['entityIndexes', 'indexes', finalIndexHash]);
			if (!index) {
				return undefined;
			}
			return {
				...index,
				content: getDynamicEntityIndexContentSelector(finalIndexHash)(state),
			};
		};
