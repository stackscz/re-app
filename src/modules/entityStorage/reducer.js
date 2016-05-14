import _ from 'lodash';
import invariant from 'invariant';
import { createReducer, typeInvariant } from 're-app/utils';
import { getEntityGetter, getEntityStatusGetter } from './selectors';

import {
	RECEIVE_ENTITY,
	RECEIVE_ENTITIES,
	MERGE_ENTITY,
	PERSIST_ENTITY,
	RECEIVE_PERSIST_ENTITY_SUCCESS,
	RECEIVE_PERSIST_ENTITY_FAILURE,
	DELETE_ENTITY,
	RECEIVE_DELETE_ENTITY_SUCCESS,
	RECEIVE_DELETE_ENTITY_FAILURE
} from './actions';
import update from 're-app/utils/immutabilityHelper';

import {
	CollectionName,
	EntityId,
	EntityStatus,
	NormalizedEntity,
	NormalizedEntityDictionary,
	ReceiveEntityActionPayload,
	ReceiveEntitiesActionPayload
} from './types';

import t from 'tcomb';

export default createReducer(
	t.struct({
		collections: NormalizedEntityDictionary,
		statuses: t.dict(CollectionName, t.dict(EntityId, t.maybe(EntityStatus))),
		errors: t.dict(CollectionName, t.dict(EntityId, t.maybe(t.Object)))
	}),
	{
		collections: {},
		statuses: {},
		errors: {}
	},
	{
		[RECEIVE_ENTITY]: (state, action) => {
			typeInvariant(action.payload, ReceiveEntityActionPayload);
			const {collectionName, entityId, normalizedEntities, validAtTime} = action.payload;

			let newState = state;
			newState = newState.merge({
				collections: normalizedEntities,
				statuses: _.mapValues(normalizedEntities, (entityList, statusCollectionName) => {
					return _.mapValues(entityList, (x, statusEntityId) => {
						let currentStatus = _.get(state, ['statuses', statusCollectionName, statusEntityId]);
						if (!currentStatus) {
							currentStatus = {
								transient: false
							};
						}
						return _.merge({}, currentStatus, {
							validAtTime
						});
					});
				})
			}, {deep: true});

			return newState;

		},
		[RECEIVE_ENTITIES]: (state, action) => {
			typeInvariant(action.payload, ReceiveEntitiesActionPayload);
			const { normalizedEntities, validAtTime } = action.payload;

			let newState = state;
			newState = newState.merge({
				collections: normalizedEntities,
				statuses: _.mapValues(normalizedEntities, (entityList, statusCollectionName) => {
					return _.mapValues(entityList, (x, statusEntityId) => {
						let currentStatus = _.get(state, ['statuses', statusCollectionName, statusEntityId]);
						if (!currentStatus) {
							currentStatus = {
								transient: false
							};
						}
						return _.merge({}, currentStatus, {
							validAtTime
						});
					});
				})
			}, {deep: true});

			return newState;
		},
		[MERGE_ENTITY]: (state, action) => {
			const { entitySchema, data } = action.payload;
			typeInvariant(data, NormalizedEntity, MERGE_ENTITY + ' action invalid payload');
			const collectionName = entitySchema.name;
			const entityId = data[entitySchema.idFieldName];
			invariant(entityId, 'entityId must be set for "%s" action.', MERGE_ENTITY);
			const entity = getEntityGetter(collectionName, entityId)({entityStorage: state});
			const entityStatus = getEntityStatusGetter(collectionName, entityId)({entityStorage: state});
			const isTransient = !entity || !entityStatus || entityStatus.transient;

			return state.merge({
				collections: {
					[collectionName]: {
						[entityId]: {
							...data,
							[entitySchema.idFieldName]: entityId
						}
					}
				},
				statuses: {
					[collectionName]: {
						[entityId]: {
							...entityStatus,
							transient: isTransient
						}
					}
				},
				errors: {
					[collectionName]: {
						[entityId]: {}
					}
				},
			}, {deep: true});
		},
		[RECEIVE_PERSIST_ENTITY_SUCCESS]: (state, action) => {
			const { collectionName, normalizedEntities, transientEntityId, validAtTime }  = action.payload;

			let newState = state;

			return state
		},
		//[PERSIST_ENTITY]: (state, action) => {
		//	const { collectionName, entityId } = action.payload;
		//	invariant(collectionName, 'collectionName must be set for "%s" action.', PERSIST_ENTITY);
		//	invariant(entityId, 'entityId must be set for "%s" action.', PERSIST_ENTITY);
		//	invariant(state.collections[collectionName] && state.collections[collectionName][entityId], '%s.%s must be present in storage prior persisting with "%s".', collectionName, entityId, PERSIST_ENTITY);
		//	let newState = state;
		//	newState = update(newState, {
		//		statuses: {
		//			[collectionName]: {
		//				[entityId]: {
		//					$merge: {
		//						persisting: true
		//					}
		//				}
		//			}
		//		}
		//	});
		//	return newState;
		//},
		//[RECEIVE_PERSIST_ENTITY_SUCCESS]: (state, action) => {
		//	const { collectionName, normalizedEntities, transientEntityId, validAtTime }  = action.payload;
		//	// compute statuses for received entities
		//	const statuses = _.mapValues(normalizedEntities, (entityList) => {
		//		return _.mapValues(entityList, () => {
		//			return {
		//				transient: false,
		//				persisting: false,
		//				valid: true,
		//				validAtTime
		//			};
		//		});
		//	});
		//
		//	let newState = state;
		//	_.each(normalizedEntities, (entityDictionary, collectionName) => {
		//		newState = setupInitialCollectionSlices(newState, collectionName);
		//		// update data
		//		newState = update(newState, {
		//			collections: {
		//				[collectionName]: {'$merge': entityDictionary}
		//			}
		//		});
		//		// update statuses
		//		newState = update(newState, {
		//			statuses: {
		//				[collectionName]: {$merge: statuses[collectionName]}
		//			}
		//		});
		//	});
		//	if (transientEntityId) {
		//		// remove transient entity and its status and errors
		//		newState = update(newState, {
		//			collections: {
		//				[collectionName]: {
		//					$delete: transientEntityId
		//				}
		//			},
		//			statuses: {
		//				[collectionName]: {
		//					$delete: transientEntityId
		//				}
		//			},
		//			errors: {
		//				[collectionName]: {
		//					$delete: transientEntityId
		//				}
		//			}
		//		});
		//	}
		//	return newState;
		//},
		//[RECEIVE_PERSIST_ENTITY_FAILURE]: (state, action) => {
		//	const { collectionName, entityId, errors } = action.payload;
		//	let newState = state;
		//	if (!state.errors[collectionName]) {
		//		newState = update(newState, {
		//			errors: {
		//				[collectionName]: {$set: {}}
		//			}
		//		});
		//	}
		//	newState = update(newState, {
		//		errors: {
		//			[collectionName]: {
		//				[entityId]: {$set: errors}
		//			}
		//		},
		//		statuses: {
		//			[collectionName]: {
		//				[entityId]: {$merge: {persisting: false}}
		//			}
		//		}
		//	});
		//	return newState;
		//},
		[DELETE_ENTITY]: (state, action) => {
			const { collectionName, entityId } = action.payload;
			invariant(_.get(state, ['collections', collectionName, entityId]), 'unknown entity to delete');
			return state.merge({
				statuses: {
					[collectionName]: {
						[entityId]: {
							transient: true,
							//deleting: true
						}
					}
				}
			}, {deep: true});
		},
		[RECEIVE_DELETE_ENTITY_SUCCESS]: (state, action) => {
			const { collectionName, entityId } = action.payload;

			return state
				.setIn(['collections', collectionName], state.collections[collectionName].without(entityId))
				.setIn(['statuses', collectionName], state.statuses[collectionName].without(entityId));
		},
		//[RECEIVE_DELETE_ENTITY_FAILURE]: (state, action) => {
		//	const { collectionName, entityId } = action.payload;
		//	return update(state, {
		//		statuses: {
		//			[collectionName]: {
		//				[entityId]: {
		//					$merge: {
		//						transient: false,
		//						deleting: false
		//					}
		//				}
		//			}
		//		}
		//	});
		//}
	}
);

//function setupInitialCollectionSlices(state, collectionName) {
//	return update(state, {
//		collections: {
//			[collectionName]: {
//				$apply: (value) => {
//					return !value ? {} : value;
//				}
//			}
//		},
//		statuses: {
//			[collectionName]: {
//				$apply: (value) => {
//					return !value ? {} : value;
//				}
//			}
//		},
//		errors: {
//			[collectionName]: {
//				$apply: (value) => {
//					return !value ? {} : value;
//				}
//			}
//		}
//	});
//}
