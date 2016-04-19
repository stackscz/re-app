/* eslint-disable */
import _ from 'lodash';
import { createReducer, validateObject } from 're-app/utils';
import {
	RECEIVE_ENTITIES,
	MERGE_ENTITY,
	PERSIST_ENTITY,
	RECEIVE_PERSIST_ENTITY_SUCCESS,
	RECEIVE_PERSIST_ENTITY_FAILURE
} from './actions';
import update from 're-app/utils/immutabilityHelper';
import { PropTypes } from 'react';
import { normalize } from 'normalizr';
import invariant from 'invariant';
import {
	getEntityGetter
} from 're-app/selectors';


export default createReducer({
	collections: {},
	statuses: {},
	errors: {}
}, {
	[RECEIVE_ENTITIES]: (state, action) => {
		validateObject(action.payload, receiveEntitiesActionPayloadSchema);
		const { normalizedEntities, validAtTime } = action.payload;
		// compute statuses for received entities
		let statuses = _.mapValues(normalizedEntities, (entityList) => {
			return _.mapValues(entityList, () => {
				return {
					transient: false,
					valid: true,
					validAtTime
				}
			});
		});

		let newState = state;
		_.each(normalizedEntities, (entityDictionary, collectionName) => {
			newState = setupInitialCollectionSlices(newState, collectionName);
			// update data
			newState = update(newState, {
				collections: {
					[collectionName]: {'$merge': entityDictionary}
				}
			});
			// update statuses
			newState = update(newState, {
				statuses: {
					[collectionName]: {$merge: statuses[collectionName]}
				}
			});
		});
		return newState;
	},
	[MERGE_ENTITY]: (state, action) => {
		const { collectionName, entityId, data } = action.payload;
		invariant(entityId, 'entityId must be set for "%s" action.', MERGE_ENTITY);
		const entity = _.get(state, ['collections', collectionName, entityId]);
		const isTransient = !entity;
		let newState = state;
		newState = setupInitialCollectionSlices(newState, collectionName);
		newState = update(newState, {
			collections: {
				[collectionName]: {
					[entityId]: {
						$apply: (entityData) => {
							return _.merge(entityData || {}, data)
						}
					}
				}
			},
			statuses: {
				[collectionName]: {
					[entityId]: {
						$apply: (entityStatus) => {
							return !entityStatus ? {
								transient: isTransient,
								persisting: false,
								fetching: false
							} : entityStatus;
						}
					}
				}
			},
			errors: {
				[collectionName]: {
					[entityId]: {
						$apply: (value) => {
							return !value ? {} : value;
						}
					}
				}
			}
		});
		return newState;
	},
	[PERSIST_ENTITY]: (state, action) => {
		const { collectionName, entityId } = action.payload;
		invariant(collectionName, 'collectionName must be set for "%s" action.', PERSIST_ENTITY);
		invariant(entityId, 'entityId must be set for "%s" action.', PERSIST_ENTITY);
		invariant(state.collections[collectionName] && state.collections[collectionName][entityId], '%s.%s must be present in storage prior persisting with "%s".', collectionName, entityId, PERSIST_ENTITY);
		let newState = state;
		newState = update(newState, {
			statuses: {
				[collectionName]: {
					[entityId]: {
						$merge: {
							persisting: true
						}
					}
				}
			}
		});
		return newState;
	},
	[RECEIVE_PERSIST_ENTITY_SUCCESS]: (state, action) => {
		const { collectionName, entityId, normalizedEntities, transientEntityId, validAtTime }  = action.payload;
		// compute statuses for received entities
		let statuses = _.mapValues(normalizedEntities, (entityList) => {
			return _.mapValues(entityList, () => {
				return {
					transient: false,
					persisting: false,
					valid: true,
					validAtTime
				}
			});
		});

		let newState = state;
		_.each(normalizedEntities, (entityDictionary, collectionName) => {
			newState = setupInitialCollectionSlices(newState, collectionName);
			// update data
			newState = update(newState, {
				collections: {
					[collectionName]: {'$merge': entityDictionary}
				}
			});
			// update statuses
			newState = update(newState, {
				statuses: {
					[collectionName]: {$merge: statuses[collectionName]}
				}
			});
		});
		if (transientEntityId) {
			// remove transient entity and its status and errors
			newState = update(newState, {
				collections: {
					[collectionName]: {
						$delete: transientEntityId
					}
				},
				statuses: {
					[collectionName]: {
						$delete: transientEntityId
					}
				},
				errors: {
					[collectionName]: {
						$delete: transientEntityId
					}
				}
			})
		}
		return newState;
	},
	[RECEIVE_PERSIST_ENTITY_FAILURE]: (state, action) => {
		const { collectionName, entityId, errors } = action.payload;
		let newState = state;
		if (!state.errors[collectionName]) {
			newState = update(newState, {
				errors: {
					[collectionName]: {$set: {}}
				}
			});
		}
		newState = update(newState, {
			errors: {
				[collectionName]: {
					[entityId]: {$set: errors}
				}
			},
			statuses: {
				[collectionName]: {
					[entityId]: {$merge: {persisting: false}}
				}
			}
		});
		return newState;
	}
});

const receiveEntitiesActionPayloadSchema = PropTypes.shape({
	normalizedEntities: PropTypes.objectOf(PropTypes.object).isRequired,
	validAtTime: PropTypes.string
});

function setupInitialCollectionSlices(state, collectionName) {
	return update(state, {
		collections: {
			[collectionName]: {
				$apply: (value) => {
					return !value ? {} : value;
				}
			}
		},
		statuses: {
			[collectionName]: {
				$apply: (value) => {
					return !value ? {} : value;
				}
			}
		},
		errors: {
			[collectionName]: {
				$apply: (value) => {
					return !value ? {} : value;
				}
			}
		}
	});
}
