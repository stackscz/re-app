/* eslint-disable */
import { createReducer, validateObject } from 're-app/utils';
import {
	STORE_ENTITIES
} from './actions';
import update from 'immutability-helper';
import { PropTypes } from 'react';

export default createReducer({
	collections: {},
	statuses: {} // TODO
}, {
	[STORE_ENTITIES]: (state, action) => {
		validateObject(action.payload, storeEntitiesActionPayloadSchema);
		const { normalizedEntities } = action.payload;
		let newState = state;
		_.each(normalizedEntities, (entityDictionary, collectionName) => {
			if (!newState.collections[collectionName]) {
				newState = update(newState, {
					collections: {
						[collectionName]: {$set: {}}
					}
				})
			}
			if (!newState.statuses[collectionName]) {
				newState = update(newState, {
					statuses: {
						[collectionName]: {$set: {}}
					}
				})
			}
			newState = update(newState, {
				collections: {
					[collectionName]: {'$merge': entityDictionary}
				}
			});
		});
		return newState;
	},
	// TODO update statuses
	//[FETCH_ENTITY_SUCCESS]: (state, action) => {
	//	const {entityMapping, entity} = action.payload;
	//	const normalized = normalize(entity, entityMapping);
	//	let newState = state;
	//	_.each(normalized.entities, (dictionary, collectionName) => {
	//		if (!newState.entities[collectionName]) {
	//			newState = update(newState, {
	//				entities: {
	//					[collectionName]: {$set: {}}
	//				}
	//			})
	//		}
	//		newState = update(newState, {
	//			entities: {
	//				[collectionName]: {'$merge': dictionary}
	//			}
	//		});
	//	});
	//	return newState;
	//}
});

const storeEntitiesActionPayloadSchema = PropTypes.shape({
	normalizedEntities: PropTypes.objectOf(PropTypes.object)
});
