import _ from 'lodash';

import normalizeFilter from './utils/normalizeFilter';

export const getEntityIndexSelector = (indexHash) =>
	(state) =>
		state.entityIndexes.indexes[indexHash];

/**
 * Selects index with transient entities matching `where` key value of filter
 *
 * @param {string} indexHash
 */
export const getDynamicEntityIndexContentSelector = (indexHash:string) =>
	(state) => {
		const index = _.get(state, ['entityIndexes', 'indexes', indexHash]);
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
