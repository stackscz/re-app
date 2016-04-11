/* eslint-disable */
import _ from 'lodash';
import { createReducer } from 're-app/utils';
import {
	ENSURE_ENTITY_INDEX,
	ENSURE_ENTITY_INDEX_SUCCESS,
	ENSURE_ENTITY_INDEX_FAILURE,
	FETCH_ENTITY_INDEX,
	FETCH_ENTITY_INDEX_SUCCESS,
	FETCH_ENTITY_INDEX_FAILURE,
	RECEIVE_ENTITY_INDEX,
	FETCH_ENTITY_SUCCESS
} from  './actions';
import hash from 'object-hash';
import { normalize, arrayOf } from 'normalizr';
import update from 'immutability-helper';

export default createReducer({
	indexes: {},
	existingCounts: {},
	entities: {}
}, {
	[ENSURE_ENTITY_INDEX]: (state, action) => {
		const {collectionName, filter} = action.payload;
		const indexHash = hash({collectionName, filter});
		const index = state.indexes[indexHash];
		if (!index) {
			return update(state, {
				indexes: {
					[indexHash]: {
						$set: {
							collectionName,
							filter,
							ready: false,
							fetching: false,
							index: [],
							errors: []
						}
					}
				}
			});
		}
		return state;
	},
	[ENSURE_ENTITY_INDEX_SUCCESS]: (state, action) => {
		const {indexHash} = action.payload;
		return update(state, {
			indexes: {
				[indexHash]: {
					ready: {$set: true}
				}
			}
		});
	},
	[ENSURE_ENTITY_INDEX_FAILURE]: (state, action) => {
		const {indexHash} = action.payload;
		return update(state, {
			indexes: {
				[indexHash]: {
					ready: {$set: false}
				}
			}
		});
	},
	[FETCH_ENTITY_INDEX]: (state, action) => {
		const {indexHash} = action.payload;
		return update(state, {
			indexes: {
				[indexHash]: {
					fetching: {$set: true}
				}
			}
		});
	},
	[FETCH_ENTITY_INDEX_SUCCESS]: (state, action) => {
		const {indexHash, entityMapping, existingCount, entities} = action.payload;
		const collectionName = state.indexes[indexHash].collectionName;
		const normalized = normalize(entities, arrayOf(entityMapping));
		let newState = update(state, {
			indexes: {
				[indexHash]: {
					index: {$set: normalized.result},
					fetching: {$set: false}
				}
			},
			existingCounts: {
				[collectionName]: {$set: existingCount}
			}
		});
		_.each(normalized.entities, (dictionary, collectionName) => {
			if (!newState.entities[collectionName]) {
				newState = update(newState, {
					entities: {
						[collectionName]: {$set: {}}
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
	[FETCH_ENTITY_INDEX_FAILURE]: (state, action) => {
		const {indexHash, errors} = action.payload;
		return update(state, {
			indexes: {
				[indexHash]: {
					fetching: {$set: false},
					errors: {$set: errors}
				}
			}
		});
	},
	[FETCH_ENTITY_SUCCESS]: (state, action) => {
		const {entityMapping, entity} = action.payload;
		const normalized = normalize(entity, entityMapping);
		let newState = state;
		_.each(normalized.entities, (dictionary, collectionName) => {
			if (!newState.entities[collectionName]) {
				newState = update(newState, {
					entities: {
						[collectionName]: {$set: {}}
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
