/* eslint-disable */
import expect from 'expect';
import _ from 'lodash';
import Immutable from 'seamless-immutable';
import reducer from 'modules/entityStorage/reducer';
import {
	INIT
} from 'utils/actions';
import {
	ENSURE_ENTITY,
	ATTEMPT_FETCH_ENTITY,
	RECEIVE_FETCH_ENTITY_FAILURE,
	RECEIVE_ENTITIES,
	MERGE_ENTITY,
	PERSIST_ENTITY,
	RECEIVE_PERSIST_ENTITY_SUCCESS,
	RECEIVE_PERSIST_ENTITY_FAILURE,
} from 'modules/entityStorage/actions';

describe('modules/entityStorage/reducer', () => {

	const expectedInitialState = {
		collections: {},
		statuses: {},
		errors: {},
	};

	const entitySchema = {
		name: 'posts',
		idFieldName: 'id',
		displayFieldName: 'title',
		isFilterable: true,
		fields: {
			id: {
				name: 'id',
				type: 'integer',
				label: 'Id',
			},
			title: {
				name: 'title',
				type: 'string',
				label: 'Title',
			},
		},
	};

	it('should return the initial state', () => {
		expect(
			reducer(undefined, {})
		).toEqual(expectedInitialState)
	});

	it(`should not handle ${MERGE_ENTITY}`, () => {
		const state = reducer(undefined, {
			type: MERGE_ENTITY,
			payload: {
				collectionName: 'posts',
				data: {},
				noInteraction: false,
			},
		});
		expect(state).toEqual(expectedInitialState);
	});

	const notFoundError = {
		code: 404,
		message: 'Not found',
	};
	const validAtTime = "2016-06-10T10:00:00+00:00";

	describe(`should handle ${ENSURE_ENTITY}`, () => {

		it(`should set proper statuses for unknown entity`, () => {
			let state = reducer(
				undefined,
				{
					type: ENSURE_ENTITY,
					payload: {
						collectionName: 'posts',
						entityId: 'unknownid',
					},
				}
			);

			expect(state).toInclude({
				statuses: {
					posts: {
						unknownid: {
							transient: true,
							fetching: false,
							persisting: false,
							deleting: false,
						},
					},
				},
			});
		});

		it(`should set proper statuses for known entity`, () => {
			_.each([true, false], (initiallyTransient) => {
				const expectedStatus = {
					transient: initiallyTransient,
					fetching: true,
					persisting: false,
					deleting: true,
				};

				let state = reducer(
					Immutable.from({
						collections: {
							posts: {
								knownid: {
									id: 'knownid',
								},
							},
						},
						statuses: {
							posts: {
								knownid: expectedStatus,
							},
						},
						errors: {},
					}),
					{
						type: ENSURE_ENTITY,
						payload: {
							collectionName: 'posts',
							entityId: 'knownid',
						},
					}
				);

				expect(state).toInclude({
					statuses: {
						posts: {
							knownid: expectedStatus,
						},
					},
				});
			});
		});

	});

	describe(`should handle ${ATTEMPT_FETCH_ENTITY}`, () => {

		it(`should set proper statuses for unknown entity`, () => {
			let state = reducer(undefined, {
				type: ATTEMPT_FETCH_ENTITY,
				payload: {
					collectionName: 'posts',
					entityId: 'unknownid',
				},
			});

			expect(state).toInclude({
				statuses: {
					posts: {
						unknownid: {
							transient: true,
							fetching: true,
							persisting: false,
							deleting: false,
						}
					},
				},
			});
		});

		it(`should set proper statuses for known entity`, () => {

			const expectedStatus = {
				transient: false,
				fetching: false,
				persisting: false,
				deleting: false,
			};

			let state = reducer(
				Immutable.from({
					collections: {
						posts: {
							knownid: {
								id: 'knownid',
							},
						},
					},
					statuses: {
						posts: {
							knownid: {
								transient: false,
								fetching: false,
								persisting: false,
								deleting: false,
							},
						},
					},
					errors: {},
				}),
				{
					type: ATTEMPT_FETCH_ENTITY,
					payload: {
						collectionName: 'posts',
						entityId: 'knownid',
					},
				}
			);

			expect(state).toInclude({
				statuses: {
					posts: {
						knownid: {
							transient: false,
							fetching: true,
							persisting: false,
							deleting: false,
						},
					},
				},
			});
		});

	});

	describe(`should handle ${RECEIVE_FETCH_ENTITY_FAILURE}`, () => {

		it(`should set errors and statuses`, () => {
			let state = reducer(
				Immutable.from({
					collections: {
						posts: {
							1: {
								id: '1'
							}
						}
					},
					statuses: {
						posts: {
							1: {
								transient: false,
								fetching: false,
								persisting: false,
								deleting: false,
							}
						}
					},
				}),
				{
					type: RECEIVE_FETCH_ENTITY_FAILURE,
					payload: {
						collectionName: 'posts',
						entityId: '1',
						error: notFoundError,
					},
				}
			);
			state = reducer(state, {
				type: RECEIVE_FETCH_ENTITY_FAILURE,
				payload: {
					collectionName: 'posts',
					entityId: '2',
					error: notFoundError,
				},
			});

			expect(state.statuses).toInclude({
				posts: {
					1: {
						transient: true,
						fetching: false,
						persisting: false,
						deleting: false,
					},
					2: {
						transient: true,
						fetching: false,
						persisting: false,
						deleting: false,
					},
				},
			});
			expect(state.errors).toEqual({
				posts: {
					1: notFoundError,
					2: notFoundError,
				},
			});
		});

		it(`should replace (not merge) errors`, () => {

			let state = reducer(undefined, {
				type: RECEIVE_FETCH_ENTITY_FAILURE,
				payload: {
					collectionName: 'posts',
					entityId: '1',
					error: {
						code: 100,
						message: 'Some weird error',
						additionalData: 'data',
					},
				},
			});
			state = reducer(state, {
				type: RECEIVE_FETCH_ENTITY_FAILURE,
				payload: {
					collectionName: 'posts',
					entityId: '1',
					error: notFoundError,
				},
			});
			expect(state.errors.posts['1']).toEqual(notFoundError);
		});

	});

	describe(`should handle ${RECEIVE_ENTITIES}`, () => {

		it(`should store entities`, () => {

			let state = reducer(
				{
					collections: {
						posts: {
							1: {
								id: 1,
								title: 'Post title',
							},
						},
						tags: {
							1: {
								id: 1,
								name: 'Tag name',
							},
						},
					},
					statuses: {
						posts: {
							1: {
								transient: false,
							}
						},
						tags: {
							1: {
								transient: true,
							}
						},
					},
				},
				{
					type: INIT,
				}
			);
			state = reducer(state, {
				type: RECEIVE_ENTITIES,
				payload: {
					normalizedEntities: {
						posts: {
							1: {
								id: 1,
								title: 'Post title',
							},
						},
						tags: {
							1: {
								id: 1,
								name: 'Tag name',
							},
						},
					},
					validAtTime,
				},
			});

			expect(state).toInclude({
				collections: {
					posts: {
						1: {
							id: 1,
							title: 'Post title',
						},
					},
					tags: {
						1: {
							id: 1,
							name: 'Tag name',
						},
					},
				},
				statuses: {
					posts: {
						1: {
							validAtTime,
							transient: false,
						}
					},
					tags: {
						1: {
							validAtTime,
							transient: false,
						}
					},
				}
			}).toExcludeKey(
				{
					errors: {
						posts: {
							1: true
						},
						tags: {
							1: true
						},
					}
				}
			)
		});

		it(`should replace (not merge) entities`, () => {

			let state = reducer(undefined, {
				type: RECEIVE_ENTITIES,
				payload: {
					normalizedEntities: {
						posts: {
							1: {
								id: 1,
								title: 'Post title',
							},
						},
						tags: {
							1: {
								id: 1,
								name: 'Tag name',
							},
						},
					},
					validAtTime,
				},
			});
			state = reducer(state, {
				type: RECEIVE_ENTITIES,
				payload: {
					normalizedEntities: {
						posts: {
							1: {
								id: 1,
							},
						},
						tags: {
							1: {
								id: 1,
							},
						},
					},
					validAtTime,
				},
			});
			expect(state.collections.posts['1']).toEqual({
				id: 1,
			});
			expect(state.collections.tags['1']).toEqual({
				id: 1,
			});
		});

	});

	describe(`should handle ${PERSIST_ENTITY}`, () => {

		it(`should store entity with proper status`, () => {
			const newEntityId = '5b34h5j432j';
			let state = reducer(undefined, {
				type: PERSIST_ENTITY,
				payload: {
					entitySchema,
					entityId: newEntityId,
					entity: {
						id: newEntityId,
						title: 'Some Post',
					},
					noInteraction: false,
				},
			});
			expect(state).toInclude({
				collections: {
					posts: {
						[newEntityId]: {
							id: newEntityId,
							title: 'Some Post',
						},
					},
				},
				statuses: {
					posts: {
						[newEntityId]: {
							transient: true,
							persisting: true,
						},
					},
				},
			});
		});

		it(`should replace (not merge) entity`, () => {
			const newEntityId = '5b34h5j432j';
			let state = reducer(undefined, {
				type: PERSIST_ENTITY,
				payload: {
					entitySchema,
					entityId: newEntityId,
					entity: {
						id: newEntityId,
						title: 'Some Post',
						some: 'Additional prop',
					},
					noInteraction: false,
				},
			});
			state = reducer(state, {
				type: PERSIST_ENTITY,
				payload: {
					entitySchema,
					entityId: newEntityId,
					entity: {
						id: newEntityId,
						title: 'Some Post',
					},
					noInteraction: false,
				},
			});
			expect(state.collections.posts[newEntityId]).toEqual({
				id: newEntityId,
				title: 'Some Post',
			});
			expect(state).toInclude({
				statuses: {
					posts: {
						[newEntityId]: {
							transient: true,
							persisting: true,
						},
					},
				}
			});

		});

	});

	describe(`should handle ${RECEIVE_PERSIST_ENTITY_SUCCESS}`, () => {

		it('should set resulting entities and statuses', () => {
			let state = reducer(undefined, {
				type: RECEIVE_PERSIST_ENTITY_SUCCESS,
				payload: {
					validAtTime,
					collectionName: 'posts',
					normalizedEntities: {
						posts: {
							1: {
								id: 1
							}
						}
					}
				},
			});

			expect(state).toInclude({
				collections: {
					posts: {
						1: {
							id: 1
						}
					}
				},
				statuses: {
					posts: {
						1: {
							validAtTime,
							transient: false,
							persisting: false,
						}
					}
				},
			})
		});

		it('should replace transient entity', () => {

			const transientId = 'n4bh3j2';
			let state = reducer(
				Immutable.from({
					collections: {
						posts: {
							[transientId]: {
								id: transientId
							}
						}
					},
					statuses: {
						posts: {
							[transientId]: {
								transient: true,
								persisting: true,
							}
						}
					},
					errors: {},
				}),
				{
					type: RECEIVE_PERSIST_ENTITY_SUCCESS,
					payload: {
						validAtTime,
						collectionName: 'posts',
						normalizedEntities: {
							posts: {
								1: {
									id: 1
								}
							}
						},
						transientEntityId: transientId
					},
				}
			);

			expect(state).toInclude({
				statuses: {
					posts: {
						1: {
							validAtTime,
							transient: false,
							persisting: false,
						}
					}
				},
			});
		});

	});

	describe(`should handle ${RECEIVE_PERSIST_ENTITY_FAILURE}`, () => {

		let state = reducer(undefined, {
			type: RECEIVE_PERSIST_ENTITY_FAILURE,
			payload: {
				collectionName: 'posts',
				entityId: '1',
				error: notFoundError,
			},
		});

		it('should set proper statuses and error', () => {
			expect(state).toInclude({
				statuses: {
					posts: {
						1: {
							transient: false,
							persisting: false,
						}
					}
				},
				errors: {
					posts: {
						1: notFoundError
					}
				}
			});
		});

	});

});
