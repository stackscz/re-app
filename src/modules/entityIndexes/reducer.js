// @flow
import _ from 'lodash';
import { createReducer } from 're-app/utils';
import Immutable from 'seamless-immutable';
import t from 'tcomb';
import type { Error } from 'types/Error';
import type { CollectionName } from 'types/CollectionName';
import type { EntityId } from 'types/EntityId';
import type { EntityIndexFilter } from 'types/EntityIndexFilter';
import {
	ENSURE_ENTITY_INDEX,
	ATTEMPT_FETCH_ENTITY_INDEX,
	RECEIVE_ENTITY_INDEX,
	RECEIVE_FETCH_ENTITY_INDEX_FAILURE,
	SET_LIMIT,
} from './actions';
import {
	RECEIVE_PERSIST_ENTITY_SUCCESS,
	RECEIVE_DELETE_ENTITY_SUCCESS,
} from '../entityStorage/actions';
import hash from 'object-hash';

export default createReducer(
	t.struct({
		indexes: t.dict(
			t.String,
			t.struct({
				modelName: CollectionName,
				filter: EntityIndexFilter,
				fetching: t.Boolean,
				content: t.maybe(t.list(EntityId)),
				error: t.maybe(Error),
			})
		),
	}),
	Immutable.from({
		limit: 20,
		indexes: {},
		existingCounts: {},
	}),
	{
		[ENSURE_ENTITY_INDEX]: [
			t.struct({
				modelName: CollectionName,
				filter: EntityIndexFilter,
			}),
			(state, action) => {
				const { modelName, filter } = action.payload;
				const indexHash = hash({ modelName, filter });
				const index = state.indexes[indexHash];
				if (!index) {
					return state.setIn(
						['indexes', indexHash],
						{
							modelName,
							filter,
							fetching: false,
							error: undefined,
						}
					);
				}
				return state;
			},
		],
		[ATTEMPT_FETCH_ENTITY_INDEX]: [
			t.struct({
				indexHash: t.String,
			}),
			(state, action) => {
				const { indexHash } = action.payload;
				if (state.indexes[indexHash]) {
					return state.setIn(
						['indexes', indexHash, 'fetching'],
						true
					);
				}
				return state;
			},
		],
		[RECEIVE_ENTITY_INDEX]: [
			t.struct({
				indexHash: t.String,
				content: t.list(EntityId),
				existingCount: t.Integer,
				validAtTime: t.String,
			}),
			(state, action) => {
				const { indexHash, content, existingCount, validAtTime } = action.payload;
				const index = state.indexes[indexHash];
				if (index) {
					const modelName = index.modelName;
					return state.merge({
						indexes: {
							[indexHash]: {
								content,
								validAtTime,
								fetching: false,
								error: undefined,
							},
						},
						existingCounts: {
							[modelName]: existingCount,
						},
					}, { deep: true });
				}
				return state;
			},
		],
		[RECEIVE_FETCH_ENTITY_INDEX_FAILURE]: [
			t.struct({
				indexHash: t.String,
				error: Error,
			}),
			(state, action) => {
				const { indexHash, error } = action.payload;
				const index = state.indexes[indexHash];
				if (index) {
					return state.merge({
						indexes: {
							[indexHash]: {
								error,
								fetching: false,
							},
						},
					}, { deep: true });
				}
				return state;
			},
		],
		[RECEIVE_PERSIST_ENTITY_SUCCESS]: (state, action) => {
			// invalidate all indexes of collection
			const { modelName } = action.payload;
			let newState = state;
			_.each(state.indexes, (index, indexId) => {
				if (index.modelName === modelName) {
					newState = newState.merge({
						indexes: {
							[indexId]: {
								valid: false,
							},
						},
					}, { deep: true });
				}
			});
			return newState;
		},
		[RECEIVE_DELETE_ENTITY_SUCCESS]: (state, action) => {
			// remove entity id from all indexes of collection and invalidate them
			const { modelName, entityId } = action.payload;
			let newState = state;
			_.each(newState.indexes, (index, indexId) => {
				if (index.modelName === modelName) {
					const entityIdIndex = _.indexOf(index.content, entityId);
					if (entityIdIndex > -1) {
						newState = newState.setIn(
							['indexes', indexId, 'content'],
							index.content.flatMap(
								(containedEntityId) =>
									(containedEntityId === entityId ? [] : containedEntityId)
							)
						);
						newState = newState.setIn(
							['indexes', indexId, 'valid'],
							false
						);
					}
				}
			});
			return newState;
		},
		[SET_LIMIT]: (state, action) => {
			const { limit } = action.payload;
			return state.set('limit', limit);
		},
	}
);
