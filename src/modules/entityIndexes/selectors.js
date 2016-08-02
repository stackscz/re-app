import _ from 'lodash';
import hash from 'object-hash';

import normalizeFilter from './utils/normalizeFilter';

import type { EntityIndexFilter } from 'types/EntityIndexFilter';

export const getEntityIndexSelector = (indexHash) =>
	(state) =>
		state.entityIndexes.indexes[indexHash];

/**
 * Selects index.content with transient entities matching `where` key value of filter, sorted
 *
 * @param {string} indexHash
 */
export const getDynamicEntityIndexContentSelector =
	(indexHash:string|{collectionName:string, filter: EntityIndexFilter}) =>
		(state) => {
			let finalIndexHash = indexHash;
			if (!_.isString(finalIndexHash)) {
				finalIndexHash = hash(indexHash);
			}
			const index = _.get(state, ['entityIndexes', 'indexes', finalIndexHash]);
			if (!index || !index.content) {
				return undefined;
			}
			const collection = _.get(state, ['entityStorage', 'collections', index.collectionName]);
			if (!collection) {
				return index.content;
			}
			const normalizedFilter = normalizeFilter(index.filter);
			const indexEntityIdsMap = _.zipObject(index.content, index.content.map(() => true));
			const result = [...index.content];
			let noUnlisted = true;
			_.each(collection, (entity, entityId) => {
				if (_.isMatch(entity, normalizedFilter.where) && !indexEntityIdsMap[entityId]) {
					noUnlisted = false;
					result.push(entityId);
				}
			});
			if (noUnlisted) {
				return result;
			}

			return _.orderBy(
				result,
				normalizedFilter.order.map(
					(sortSpec) =>
						(entityId) => _.get(collection, [entityId, _.trimStart(sortSpec, '-')])
				),
				normalizedFilter.order.map(
					(sortSpec) =>
						(_.startsWith(sortSpec, '-') ? 'desc' : 'asc')
				)
			);
		};

export const getDynamicEntityIndexSelector =
	(indexHash:string|{collectionName:string, filter: EntityIndexFilter}) =>
		(state) => {
			let finalIndexHash = indexHash;
			if (!_.isString(finalIndexHash)) {
				finalIndexHash = hash(indexHash);
			}
			const index = _.get(state, ['entityIndexes', 'indexes', finalIndexHash]);
			if (!index || !index.content) {
				return undefined;
			}
			return {
				...index,
				content: getDynamicEntityIndexContentSelector(finalIndexHash)(state),
			};
		};
