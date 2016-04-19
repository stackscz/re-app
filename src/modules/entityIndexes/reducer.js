/* eslint-disable */
import _ from 'lodash';
import { createReducer } from 're-app/utils';
import {
	ENSURE_ENTITY_INDEX,
	CONFIRM_ENTITY_INDEX,
	ENSURE_ENTITY_INDEX_FAILURE,
	FETCH_ENTITY_INDEX,
	RECEIVE_ENTITY_INDEX,
	FETCH_ENTITY_INDEX_FAILURE
} from  './actions';
import {
	RECEIVE_PERSIST_ENTITY_SUCCESS
} from '../entityStorage/actions';
import hash from 'object-hash';
import { normalize, arrayOf } from 'normalizr';
import update from 'immutability-helper';

export default createReducer({
	indexes: {},
	existingCounts: {}
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
							valid: false,
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
	[CONFIRM_ENTITY_INDEX]: (state, action) => {
		const {indexHash} = action.payload;
		return update(state, {
			indexes: {
				[indexHash]: {
					ready: {$set: true},
					valid: {$set: true}
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
	[RECEIVE_ENTITY_INDEX]: (state, action) => {
		const { indexHash, index, existingCount, validAtTime } = action.payload;
		const collectionName = state.indexes[indexHash].collectionName;
		return update(state, {
			indexes: {
				[indexHash]: {
					index: {$set: index},
					fetching: {$set: false},
					valid: {$set: true},
					validAtTime: {$set: validAtTime}
				}
			},
			existingCounts: {
				[collectionName]: {$set: existingCount}
			}
		});
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
	[RECEIVE_PERSIST_ENTITY_SUCCESS]: (state, action) => {
		// invalidate all indexes of collection
		const { collectionName }  = action.payload;
		let newState = state;
		_.each(state.indexes, (index, indexId) => {
			if(index.collectionName === collectionName) {
				newState = update(newState, {
					indexes: {
						[indexId]: {$merge: {valid: false}}
					}
				});
			}
		});
		return newState
	}
});
