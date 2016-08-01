import _ from 'lodash';
import invariant from 'invariant';
import Immutable from 'seamless-immutable';
import t from 'tcomb';

import { createReducer } from 're-app/utils';

import {
	ENSURE_ENTITY,
	ATTEMPT_FETCH_ENTITY,
	RECEIVE_ENTITY,
	RECEIVE_ENTITIES,
	RECEIVE_FETCH_ENTITY_FAILURE,
	MERGE_ENTITY,
	PERSIST_ENTITY,
	RECEIVE_PERSIST_ENTITY_SUCCESS,
	RECEIVE_PERSIST_ENTITY_FAILURE,
	DELETE_ENTITY,
	RECEIVE_DELETE_ENTITY_SUCCESS,
	RECEIVE_DELETE_ENTITY_FAILURE,
	FORGET_ENTITY,
} from './actions';

import type { Error } from 'types/Error';
import type { EntitySchema } from 'types/EntitySchema';
import type { CollectionName } from 'types/CollectionName';
import type { EntityId } from 'types/EntityId';
import type { EntityStatus } from 'types/EntityStatus';
import type { NormalizedEntityDictionary } from 'types/NormalizedEntityDictionary';
const ReceiveEntityActionPayload = t.refinement(
	t.struct({
		modelName: CollectionName,
		entityId: EntityId,
		normalizedEntities: NormalizedEntityDictionary,
		validAtTime: t.String,
	}),
	(x) => {
		const requestedEntityPresent = _.get(
				x.normalizedEntities,
				[x.modelName, x.entityId]
			) === x.entityId;
		// TODO const entitiesProperlyNormalized =
		return requestedEntityPresent;
	},
	'ReceiveEntityActionPayload'
);
const ReceiveEntitiesActionPayload = t.struct({
	normalizedEntities: NormalizedEntityDictionary,
	validAtTime: t.String,
});

const defaultStatus = {
	transient: false,
	fetching: false,
	persisting: false,
	deleting: false,
};

function setEntitiesToState(state, normalizedEntities) {
	return state.update('collections', (currentValue, collections) => {
		let newValue = currentValue;
		_.each(collections, (entities, modelName) => {
			_.each(entities, (entity, entityId) => {
				newValue = newValue.setIn(
					[modelName, entityId],
					_.assign(
						{},
						// _.get(newValue, [modelName, entityId], {}),
						entity
					)
				);
			});
		});
		return newValue;
	}, normalizedEntities);
}

function setStatusWithDefaults(state, modelName, entityId, getNewStatus) {
	return state.updateIn(
		['statuses', modelName, entityId],
		(currentStatus) => _.merge({}, defaultStatus, currentStatus, getNewStatus(currentStatus))
	);
}

export default createReducer(
	t.struct({
		collections: NormalizedEntityDictionary,
		statuses: t.dict(CollectionName, t.dict(EntityId, t.maybe(EntityStatus))),
		errors: t.dict(CollectionName, t.dict(EntityId, t.maybe(t.Object))),
	}),
	Immutable.from({
		collections: {},
		statuses: {},
		errors: {},
	}),
	{
		[ENSURE_ENTITY]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
			}),
			(state, action) => {
				const { modelName, entityId } = action.payload;
				return setStatusWithDefaults(state, modelName, entityId, (currentStatus) => ({
					transient: currentStatus ? currentStatus.transient : true,
				}));
			},
		],
		[ATTEMPT_FETCH_ENTITY]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
			}),
			(state, action) => {
				const { modelName, entityId } = action.payload;
				return setStatusWithDefaults(state, modelName, entityId, (currentStatus) => ({
					transient: currentStatus ? currentStatus.transient : true,
					fetching: true,
				}));
			},
		],
		[RECEIVE_ENTITY]: [
			ReceiveEntityActionPayload,
			(state, action) => {
				const {
					normalizedEntities,
					validAtTime,
				} = action.payload;

				let newState = state;
				newState = newState.merge({
					collections: normalizedEntities,
					statuses: _.mapValues(
						normalizedEntities,
						(entityList, statusCollectionName) => _.mapValues(entityList, (x, statusEntityId) => {
							const currentStatus = _.get(
								state,
								['statuses', statusCollectionName, statusEntityId],
								{}
							);
							return _.merge({}, defaultStatus, currentStatus, {
								validAtTime,
								transient: false,
							});
						})
					),
				}, { deep: true });

				return newState;
			},
		],
		[RECEIVE_ENTITIES]: [
			ReceiveEntitiesActionPayload,
			(state, action) => {
				const { normalizedEntities, validAtTime } = action.payload;

				let newState = state;
				newState = setEntitiesToState(state, normalizedEntities);
				newState = newState.merge({
					statuses: _.mapValues(
						normalizedEntities,
						(entityList, statusModelName) => _.mapValues(entityList, (x, statusEntityId) => {
							const currentStatus = _.get(
								state,
								['statuses', statusModelName, statusEntityId]
							);
							return _.merge({}, defaultStatus, currentStatus, {
								validAtTime,
								transient: false,
								fetching: false,
							});
						})
					),
				}, { deep: true });
				_.each(
					normalizedEntities,
					(entityDictionary, modelName) => {
						newState = newState.updateIn(
							['errors', modelName],
							(entitiesErrors) => {
								if (entitiesErrors) {
									return entitiesErrors.without(_.keys(entityDictionary));
								}
								return {};
							}
						);
					}
				);

				return newState;
			},
		],
		[RECEIVE_FETCH_ENTITY_FAILURE]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				error: Error,
			}),
			(state, action) => {
				const { modelName, entityId, error } = action.payload;
				let newState = state;
				newState = setStatusWithDefaults(newState, modelName, entityId, () => ({
					transient: true,
					fetching: false,
				}));
				newState = newState.setIn(['errors', modelName, entityId], error);
				return newState;
			},
		],
		[MERGE_ENTITY]: [
			t.struct({
				modelName: t.String,
				data: t.Object,
				noInteraction: t.Boolean,
			}),
		],
		[PERSIST_ENTITY]: [
			t.struct({
				entitySchema: EntitySchema,
				entityId: EntityId,
				entity: t.Object,
				noInteraction: t.Boolean,
			}),
			(state, action) => {
				const { entitySchema, entityId, entity } = action.payload;
				const modelName = entitySchema.name;

				let newState = state;
				newState = newState.updateIn(
					['collections', modelName, entityId],
					(value, newEntity) => {
						let newValue = value;
						if (!newValue) {
							newValue = Immutable.from({});
						}
						return newValue.merge(
							{
								...newEntity,
								[entitySchema.idFieldName]: entityId,
							}
						);
					},
					entity
				);
				newState = setStatusWithDefaults(newState, modelName, entityId, (currentStatus) => ({
					persisting: true,
					transient: currentStatus ? currentStatus.transient : true,
				}));

				// newState = newState.setIn(
				// 	['errors', modelName, entityId],
				// 	{}
				// );

				return newState;
			},
		],
		[RECEIVE_PERSIST_ENTITY_SUCCESS]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				normalizedEntities: NormalizedEntityDictionary,
				validAtTime: t.String,
				transientEntityId: t.maybe(EntityId),
			}),
			(state, action) => {
				const {
					modelName,
					entityId,
					normalizedEntities,
					transientEntityId,
					validAtTime,
				} = action.payload;

				let newState = setEntitiesToState(state, normalizedEntities);

				const statuses = _.mapValues(
					normalizedEntities,
					(entityList) => _.mapValues(entityList, () => ({
						validAtTime,
						persisting: false,
						transient: false,
					}))
				);

				newState = newState.merge({
					statuses,
				}, { deep: true });
				newState = newState.setIn(
					['errors', modelName, entityId],
					{}
				);

				if (transientEntityId) {
					newState = newState.setIn(
						['collections', modelName],
						newState.collections[modelName].without(transientEntityId)
					);
					newState = newState.setIn(
						['statuses', modelName],
						newState.statuses[modelName].without(transientEntityId)
					);
				}
				return newState;
			},
		],
		[RECEIVE_PERSIST_ENTITY_FAILURE]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				error: t.Object,
			}),
			(state, action) => {
				const { modelName, entityId, error } = action.payload;

				const isTransient = _.get(
					state,
					['statuses', modelName, entityId, 'transient'],
					false
				);

				let newState = state.merge({
					statuses: {
						[modelName]: {
							[entityId]: {
								transient: isTransient,
								persisting: false,
							},
						},
					},
					errors: {
						[modelName]: {
							[entityId]: error,
						},
					},
				}, { deep: true });

				if (error.validationErrors) {
					newState = newState.merge({
						validationErrors: {
							[modelName]: {
								[entityId]: error.validationErrors,
							},
						},
					}, { deep: true });
				}
				return newState;
			},
		],
		[DELETE_ENTITY]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
			}),
			(state, action) => {
				const { modelName, entityId } = action.payload;
				invariant(
					_.get(state, ['collections', modelName, entityId]),
					'unknown entity to delete'
				);
				return state.merge({
					statuses: {
						[modelName]: {
							[entityId]: {
								transient: true,
								deleting: true,
							},
						},
					},
				}, { deep: true });
			},
		],
		[RECEIVE_DELETE_ENTITY_SUCCESS]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
			}),
			(state, action) => {
				const { modelName, entityId } = action.payload;
				return state
					.setIn(
						['collections', modelName],
						state.collections[modelName].without(`${entityId}`)
					)
					.setIn(
						['statuses', modelName],
						state.statuses[modelName].without(`${entityId}`)
					);
			},
		],
		[RECEIVE_DELETE_ENTITY_FAILURE]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				error: Error,
			}),
			(state, action) => {
				const { modelName, entityId, error } = action.payload;
				return state.merge({
					statuses: {
						[modelName]: {
							[entityId]: {
								error,
								transient: false,
								deleting: false,
							},
						},
					},
				}, { deep: true });
			},
		],
		[FORGET_ENTITY]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
			}),
			(state, action) => {
				const { modelName, entityId } = action.payload;
				let newState = state;
				_.each(['collections', 'statuses', 'errors'], (sliceName) => {
					if (_.get(newState, [sliceName, modelName])) {
						newState = newState.updateIn(
							[sliceName, modelName],
							(selectedCollectionName, entityIdToForget) => {
								if (selectedCollectionName) {
									return selectedCollectionName.without(`${entityIdToForget}`);
								}
								return selectedCollectionName;
							},
							entityId
						);
					}
				});
				return newState;
			},
		],
	},
	'entityStorage'
);
