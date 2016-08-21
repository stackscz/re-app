import _, { get as g } from 'lodash';
import invariant from 'invariant';
import hash from 'object-hash';
import Immutable from 'seamless-immutable';
import t from 'tcomb';

import { createReducer } from 're-app/utils';

import {
	ENSURE_ENTITY,
	ATTEMPT_FETCH_ENTITY,
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
// import type { EntitySchema } from 'types/EntitySchema';
import type { CollectionName } from 'types/CollectionName';
import type { EntityId } from 'types/EntityId';
import type { EntityStatus } from 'types/EntityStatus';
import type { NormalizedEntityDictionary } from 'types/NormalizedEntityDictionary';

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
		refs: t.dict(
			CollectionName,
			t.dict(
				t.String,
				t.struct({
					where: t.Object,
					entityId: t.maybe(EntityId),
				})
			)
		),
		collections: NormalizedEntityDictionary,
		statuses: t.dict(CollectionName, t.dict(EntityId, t.maybe(EntityStatus))),
		errors: t.dict(CollectionName, t.dict(EntityId, t.maybe(Error))),
	}),
	Immutable.from({
		refs: {},
		collections: {},
		statuses: {},
		errors: {},
	}),
	{
		[ENSURE_ENTITY]: [
			t.struct({
				modelName: t.String,
				where: t.Object,
			}),
			(state, action) => {
				const { modelName, where } = action.payload;
				let newState = state;

				const whereHash = hash(where);
				let statusEntityId = _.get(state, ['refs', modelName, whereHash, 'entityId']);
				if (!statusEntityId) {
					newState = newState.setIn(['refs', modelName, whereHash], {
						where,
					});
					statusEntityId = whereHash;
				}
				return setStatusWithDefaults(newState, modelName, statusEntityId, (currentStatus) => ({
					transient: currentStatus ? currentStatus.transient : true,
				}));
			},
		],
		[ATTEMPT_FETCH_ENTITY]: [
			t.struct({
				modelName: t.String,
				where: t.Object,
			}),
			(state, action) => {
				const { modelName, where } = action.payload;
				const whereHash = hash(where);
				let statusEntityId = _.get(state, ['refs', modelName, whereHash, 'entityId']);
				if (!statusEntityId) {
					statusEntityId = whereHash;
				}
				return setStatusWithDefaults(state, modelName, statusEntityId, (currentStatus) => ({
					transient: currentStatus ? currentStatus.transient : true,
					fetching: true,
				}));
			},
		],
		[RECEIVE_ENTITIES]: [
			t.struct({
				refs: t.Object,
				normalizedEntities: NormalizedEntityDictionary,
				validAtTime: t.String,
			}),
			(state, action) => {
				const { refs, normalizedEntities, validAtTime } = action.payload;

				let newState = state;

				// set entities to state
				newState = setEntitiesToState(state, normalizedEntities);

				// merge received refs
				newState = newState.setIn(['refs'], newState.refs.merge(refs, { deep: true }));

				// set statuses for refs
				newState = newState.merge({
					statuses: _.mapValues(
						refs,
						(refsForModel, refModelName) => _.reduce(refsForModel, (modelSatuses, ref) => {
							const currentStatus = _.get(
								state,
								['statuses', refModelName, ref.entityId]
							);
							return {
								...modelSatuses,
								[ref.entityId]: _.merge({}, defaultStatus, currentStatus, {
									validAtTime,
									transient: false,
									fetching: false,
								}),
							};
						}, {})
					),
				}, { deep: true });

				// set statuses for entities
				newState = newState.merge({
					statuses: _.mapValues(
						normalizedEntities,
						(entityList, statusCollectionName) => _.mapValues(entityList, (x, statusEntityId) => {
							const currentStatus = _.get(
								state,
								['statuses', statusCollectionName, statusEntityId]
							);
							return _.merge({}, defaultStatus, currentStatus, {
								validAtTime,
								transient: false,
								fetching: false,
							});
						})
					),
				}, { deep: true });

				// cleanup transient statuses and errors
				_.each(refs, (refsForModel, refModelName) => {
					const modelStatuses = _.get(newState, ['statuses', refModelName]);
					if (modelStatuses) {
						newState = newState.setIn(
							['statuses', refModelName],
							modelStatuses.without(_.keys(refsForModel))
						);
					}
					const modelErrors = _.get(newState, ['errors', refModelName]);
					if (modelErrors) {
						newState = newState.setIn(
							['errors', refModelName],
							modelErrors.without(_.keys(refsForModel))
						);
					}
				});

				return newState;
			},
		],
		[RECEIVE_FETCH_ENTITY_FAILURE]: [
			t.struct({
				modelName: t.String,
				where: t.Object,
				error: Error,
			}),
			(state, action) => {
				const { modelName, where, error } = action.payload;
				let newState = state;
				newState = setStatusWithDefaults(newState, modelName, hash(where), () => ({
					transient: true,
					fetching: false,
				}));
				newState = newState.setIn(['errors', modelName, hash(where)], error);
				return newState;
			},
		],
		[MERGE_ENTITY]: [
			t.struct({
				modelName: t.String,
				where: t.Object,
				data: t.Object,
				noInteraction: t.Boolean,
			}),
		],
		[PERSIST_ENTITY]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				where: t.Object,
				normalizedEntities: NormalizedEntityDictionary,
				noInteraction: t.Boolean,
			}),
			(state, action) => {
				const { modelName, entityId, normalizedEntities } = action.payload;

				let newState = state;
				// newState = newState.setIn(['collections', modelName, entityId], entity);
				newState = setEntitiesToState(newState, normalizedEntities);
				newState = setStatusWithDefaults(newState, modelName, entityId, (currentStatus) => ({
					persisting: true,
					transient: currentStatus ? currentStatus.transient : true,
				}));
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
					null
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
				error: Error,
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
				where: t.maybe(t.Object),
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
				modelNames: t.list(t.String),
				entityId: EntityId,
				relations: t.dict(t.String, t.list(t.String)),
			}),
			(state, action) => {
				const { modelNames, entityId, relations } = action.payload;
				let newState = state;
				_.each(modelNames, (modelName) => {
					const modelCollection = g(state, ['collections', modelName]);
					if (modelCollection) {
						newState = newState.setIn(
							['collections', modelName],
							modelCollection.without(`${entityId}`)
						);
					}

					const modelStatuses = g(state, ['statuses', modelName]);
					if (modelStatuses) {
						newState = newState.setIn(
							['statuses', modelName],
							modelStatuses.without(`${entityId}`)
						);
					}
				});
				_.each(relations, (properties, modelName) => {
					const modelCollection = g(state, ['collections', modelName]);
					if (modelCollection) {
						_.each(modelCollection, (entity, relatedEntityId) => {
							let newEntity = entity;
							_.each(properties, (propertyName) => {
								let newPropertyValue = g(newEntity, propertyName);
								if (newPropertyValue) {
									if (_.isArray(newPropertyValue)) {
										newPropertyValue = newPropertyValue.filter(
											(x) => `${x}` !== `${entityId}`
										);
									} else {
										newPropertyValue = undefined;
									}
									newEntity = newEntity.setIn(
										[propertyName],
										newPropertyValue
									);
								}
							});
							newState = newState.setIn(
								['collections', modelName, relatedEntityId],
								newEntity
							);
						});
					}
				});
				return newState;
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
				const invalidRefHashes = _.reduce(state.refs[modelName], (invalidRefs, currentRef) => {
					if (currentRef.entityId === entityId) {
						return [...invalidRefs, hash(currentRef.where)];
					}
					return invalidRefs;
				}, []);
				newState = newState.setIn(
					['refs', modelName],
					newState.refs[modelName].without(invalidRefHashes)
				);
				return newState;
			},
		],
	},
	'entityStorage'
);
