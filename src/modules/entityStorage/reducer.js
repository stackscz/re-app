import _ from 'lodash';
import invariant from 'invariant';

import { createReducer } from 're-app/utils';

import {
	getEntityGetter,
	getEntityStatusGetter,
} from './selectors';

import {
	RECEIVE_ENTITY_DESCRIPTORS,
} from 'modules/entityDescriptors/actions';

import {
	RECEIVE_ENTITY,
	RECEIVE_ENTITIES,
	RECEIVE_FETCH_ENTITY_FAILURE,
	RECEIVE_FETCH_ENTITY_COLLECTION_FAILURE,
	MERGE_ENTITY,
	PERSIST_ENTITY,
	RECEIVE_PERSIST_ENTITY_SUCCESS,
	RECEIVE_PERSIST_ENTITY_FAILURE,
	DELETE_ENTITY,
	RECEIVE_DELETE_ENTITY_SUCCESS,
	RECEIVE_DELETE_ENTITY_FAILURE,
} from './actions';

import {
	ApiErrorResult,
} from 'utils/types';
import {
	EntitySchema,
} from 'modules/entityDescriptors/types';
import {
	CollectionName,
	EntityId,
	EntityStatus,
	NormalizedEntityDictionary,
	ReceiveEntityActionPayload,
	ReceiveEntitiesActionPayload,
} from './types';

import t from 'tcomb';

export default createReducer(
	t.struct({
		collections: NormalizedEntityDictionary,
		statuses: t.dict(CollectionName, t.dict(EntityId, t.maybe(EntityStatus))),
		errors: t.dict(CollectionName, t.dict(EntityId, t.maybe(t.Object))),
		collectionsStatuses: t.Object,
		collectionsErrors: t.Object,

	}),
	{
		collections: {},
		statuses: {},
		errors: {},
		collectionsStatuses: {},
		collectionsErrors: {},
	},
	{
		[RECEIVE_ENTITY_DESCRIPTORS]: (state, action) => {
			const { entities } = action.payload;
			return state;
		},
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
							let currentStatus = _.get(state, ['statuses', statusCollectionName, statusEntityId]);
							if (!currentStatus) {
								currentStatus = {
									transient: false,
								};
							}
							return _.merge({}, currentStatus, {
								validAtTime,
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
				newState = newState.merge({
					collections: normalizedEntities,
					statuses: _.mapValues(
						normalizedEntities,
						(entityList, statusCollectionName) => _.mapValues(entityList, (x, statusEntityId) => {
							let currentStatus = _.get(state, ['statuses', statusCollectionName, statusEntityId]);
							if (!currentStatus) {
								currentStatus = {
									transient: false,
								};
							}
							return _.merge({}, currentStatus, {
								validAtTime,
							});
						})
					),
				}, { deep: true });

				return newState;
			},
		],
		[RECEIVE_FETCH_ENTITY_FAILURE]: [
			t.struct({
				collectionName: t.String,
				entityId: EntityId,
				error: ApiErrorResult,
			}),
			(state, action) => {
				const { collectionName, entityId, error } = action.payload;
				return state.merge({
					errors: {
						[collectionName]: {
							[entityId]: error,
						},
					},
				}, { deep: true });
			},
		],
		[RECEIVE_FETCH_ENTITY_COLLECTION_FAILURE]: [
			t.struct({
				collectionName: t.String,
				error: ApiErrorResult,
			}),
			(state, action) => {
				const { collectionName, error } = action.payload;
				return state.merge({
					collectionsErrors: {
						[collectionName]: error,
					},
				}, { deep: true });
			},
		],
		[MERGE_ENTITY]: [
			t.struct({
				collectionName: t.String,
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
				const { entitySchema, entity } = action.payload;
				const collectionName = entitySchema.name;
				const entityId = entity[entitySchema.idFieldName];
				invariant(entityId, 'entityId must be set for "%s" action.', MERGE_ENTITY);
				const existingEntity = getEntityGetter(collectionName, entityId)({ entityStorage: state });
				const entityStatus = getEntityStatusGetter(
					collectionName,
					entityId
				)({ entityStorage: state });
				const isTransient = !existingEntity || !entityStatus || entityStatus.transient;

				return state.merge({
					collections: {
						[collectionName]: {
							[entityId]: {
								...entity,
								[entitySchema.idFieldName]: entityId,
							},
						},
					},
					statuses: {
						[collectionName]: {
							[entityId]: {
								...entityStatus,
								transient: isTransient,
							},
						},
					},
					errors: {
						[collectionName]: {
							[entityId]: {},
						},
					},
				}, { deep: true });
			},
		],
		[RECEIVE_PERSIST_ENTITY_SUCCESS]: [
			t.struct({
				collectionName: t.String,
				normalizedEntities: NormalizedEntityDictionary,
				transientEntityId: t.maybe(EntityId),
			}),
			(state, action) => {
				const {
					collectionName,
					normalizedEntities,
					transientEntityId,
					validAtTime,
					} = action.payload;

				const statuses = _.mapValues(
					normalizedEntities,
					(entityList) => _.mapValues(entityList, () => ({
						validAtTime,
						transient: false,
					}))
				);

				let newState = state;
				newState = newState.merge({
					statuses,
					collections: normalizedEntities,
				}, { deep: true });
				if (transientEntityId) {
					newState = newState.setIn(
						['collections', collectionName],
						newState.collections[collectionName].without(transientEntityId)
					);
					newState = newState.setIn(
						['statuses', collectionName],
						newState.statuses[collectionName].without(transientEntityId)
					);
				}
				return newState;
			},
		],
		[RECEIVE_PERSIST_ENTITY_FAILURE]: [
			t.struct({
				collectionName: t.String,
				entityId: EntityId,
				error: t.Object,
				validationErrors: t.Object,
			}),
			(state, action) => {
				const { collectionName, entityId, error, validationErrors } = action.payload;
				return state.merge({
					statuses: {
						[collectionName]: {
							[entityId]: {
								error,
								validationErrors,
							},
						},
					},
				}, { deep: true });
			},
		],
		[DELETE_ENTITY]: (state, action) => {
			const { collectionName, entityId } = action.payload;
			invariant(
				_.get(state, ['collections', collectionName, entityId]),
				'unknown entity to delete'
			);
			return state.merge({
				statuses: {
					[collectionName]: {
						[entityId]: {
							transient: true,
							deleting: true,
						},
					},
				},
			}, { deep: true });
		},
		[RECEIVE_DELETE_ENTITY_SUCCESS]: (state, action) => {
			const { collectionName, entityId } = action.payload;

			return state
				.setIn(['collections', collectionName], state.collections[collectionName].without(entityId))
				.setIn(['statuses', collectionName], state.statuses[collectionName].without(entityId));
		},
		[RECEIVE_DELETE_ENTITY_FAILURE]: (state, action) => {
			const { collectionName, entityId, error } = action.payload;
			return state.merge({
				statuses: {
					[collectionName]: {
						[entityId]: {
							error,
							transient: false,
							deleting: false,
						},
					},
				},
			}, { deep: true });
		},
	},
	'entityStorage'
);
