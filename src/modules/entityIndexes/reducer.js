/* eslint-disable */
import _ from 'lodash';
import { createReducer } from 're-app/utils';
import {
	FETCH_ENTITY_INDEX_SUCCESS,
	FETCH_ENTITY_SUCCESS
} from  './actions';
import { normalize, arrayOf } from 'normalizr';
import update from 'react-addons-update';

export default createReducer({
	indexes: {},
	entities: {}
}, {
	[FETCH_ENTITY_INDEX_SUCCESS]: (state, action) => {
		const {collectionName, filter, indexHash, entityMapping, existingCount, entities} = action.payload;
		const normalized = normalize(entities, arrayOf(entityMapping));
		let newState = update(state, {
			indexes: {
				[indexHash]: {'$set': {collectionName, filter, index: normalized.result, existingCount}}
			}
		});
		_.each(normalized.entities, (dictionary, collectionName) => {
			if (!newState.entities[collectionName]) {
				newState = update(newState, {
					entities: {
						[collectionName]: {'$set': {}}
					}
				})
			}
			newState = update(newState, {
				entities: {
					[collectionName]: {'$merge': dictionary}
				}
			});
		});
		return newState;
	},
	[FETCH_ENTITY_SUCCESS]: (state, action) => {
		const {entityMapping, entity} = action.payload;
		const normalized = normalize(entity, entityMapping);
		let newState = state;
		_.each(normalized.entities, (dictionary, collectionName) => {
			if (!newState.entities[collectionName]) {
				newState = update(newState, {
					entities: {
						[collectionName]: {'$set': {}}
					}
				})
			}
			newState = update(newState, {
				entities: {
					[collectionName]: {'$merge': dictionary}
				}
			});
		});
		return newState;
	}
});
