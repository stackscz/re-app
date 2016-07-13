/* eslint-disable */
import itha from 'utils/itHandlesAction';
import expect from 'expect';
import reducer from 'modules/entityStorage/reducer';
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
	const realInitialState = {
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
		).toEqual(realInitialState);
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
		expect(state).toEqual(realInitialState);
	});

	const notFoundError = {
		code: 404,
		message: 'Not found',
	};
	const validAtTime = '2016-06-10T10:00:00+00:00';

	itha(
		reducer,
		ENSURE_ENTITY,
		[
			[
				'should set proper statuses for unknown entity',
				undefined,
				{
					collectionName: 'posts',
					entityId: '100',
				},
				{
					toInclude: {
						statuses: {
							posts: {
								100: {
									transient: true,
									fetching: false,
									persisting: false,
									deleting: false,
								},
							},
						},
					},
				},
			],
			[
				'should set proper statuses for known entity',
				{
					collections: {
						posts: {
							100: {
								id: '100',
							},
						},
					},
					statuses: {
						posts: {
							100: {
								transient: true,
								fetching: true,
								persisting: false,
								deleting: true,
							},
						},
					},
					errors: {},
				},
				{
					collectionName: 'posts',
					entityId: '100',
				},
				{
					toInclude: {
						statuses: {
							posts: {
								100: {
									transient: true,
									fetching: true,
									persisting: false,
									deleting: true,
								},
							},
						},
					},
				},
			],
		]
	);

	itha(
		reducer,
		ATTEMPT_FETCH_ENTITY,
		[
			[
				'set proper statuses for unknown entity',
				undefined,
				{
					collectionName: 'posts',
					entityId: '100',
				},
				{
					toInclude: {
						statuses: {
							posts: {
								100: {
									transient: true,
									fetching: true,
									persisting: false,
									deleting: false,
								},
							},
						},
					},
				},
			],
			[
				'set proper statuses for known entity',
				{
					collections: {
						posts: {
							100: {
								id: '100',
							},
						},
					},
					statuses: {
						posts: {
							100: {
								transient: false,
								fetching: false,
								persisting: false,
								deleting: false,
							},
						},
					},
					errors: {},
				},
				{
					collectionName: 'posts',
					entityId: '100',
				},
				{
					toInclude: {
						statuses: {
							posts: {
								100: {
									transient: false,
									fetching: true,
									persisting: false,
									deleting: false,
								},
							},
						},
					},
				},
			],
		]
	);

	itha(
		reducer,
		RECEIVE_FETCH_ENTITY_FAILURE,
		[
			[
				'set errors and statuses',
				{
					collections: {
						posts: {
							1: {
								id: '1',
							},
						},
					},
					statuses: {
						posts: {
							1: {
								transient: false,
								fetching: false,
								persisting: false,
								deleting: false,
							},
						},
					},
				},
				{
					collectionName: 'posts',
					entityId: '1',
					error: notFoundError,
				},
				{
					toInclude: {
						statuses: {
							posts: {
								1: {
									transient: true,
									fetching: false,
									persisting: false,
									deleting: false,
								},
							},
						},
					},
				},
			],
			[
				'replace (not merge) errors',
				reducer(undefined, {
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
				}),
				{
					collectionName: 'posts',
					entityId: '1',
					error: notFoundError,
				},
				{
					toEqual: {
						collections: {},
						statuses: {
							posts: {
								1: {
									transient: true,
									fetching: false,
									persisting: false,
									deleting: false,
								},
							},
						},
						errors: {
							posts: {
								1: notFoundError,
							},
						},
					},
				},
			],
		]
	);


	itha(
		reducer,
		RECEIVE_ENTITIES,
		[
			[
				'new entities',
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
							},
						},
						tags: {
							1: {
								transient: true,
							},
						},
					},
					errors: {},
				},
				{
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
				{
					toInclude: {
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
								},
							},
							tags: {
								1: {
									validAtTime,
									transient: false,
								},
							},
						},
					},
					toExcludeKey: {
						errors: {
							posts: {
								1: true,
							},
							tags: {
								1: true,
							},
						},
					}
				}
			],
			[
				'replace (not merge) entities',
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
							},
						},
						tags: {
							1: {
								transient: true,
							},
						},
					},
					errors: {},
				},
				{
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
				{
					expect: (state) => {
						expect(state.collections.posts['1']).toEqual({
							id: 1,
						});
						expect(state.collections.tags['1']).toEqual({
							id: 1,
						});
					}
				}
			]
		]
	);

	const newEntityId = '5b34h5j432j';
	itha(
		reducer,
		PERSIST_ENTITY,
		[
			[
				'store entity with proper status',
				undefined,
				{
					entitySchema,
					entityId: newEntityId,
					entity: {
						id: newEntityId,
						title: 'Some Post',
					},
					noInteraction: false,
				},
				{
					toInclude: {
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
					}
				}
			],
			[
				'replace (not merge) entity',
				{
					collections: {
						posts: {
							[newEntityId]: {
								id: newEntityId,
								title: 'Some Post',
								some: 'Additional prop',
							},
						},
					},
					statuses: {
						posts: {
							[newEntityId]: {
								transient: true,
								persisting: true,
							}
						}
					},
					errors: {},
				},
				{
					entitySchema,
					entityId: newEntityId,
					entity: {
						id: newEntityId,
						title: 'Some Post',
					},
					noInteraction: false,
				},
				{
					expect: (state) => {
						expect(state.collections.posts[newEntityId]).toEqual({
							id: newEntityId,
							title: 'Some Post',
						});
					},
					toInclude: {
						statuses: {
							posts: {
								[newEntityId]: {
									transient: true,
									persisting: true,
								},
							},
						},
					},
				},
			],
		]
	);

	const transientId = 'n4bh3j2';
	itha(
		reducer,
		RECEIVE_PERSIST_ENTITY_SUCCESS,
		[
			[
				'set resulting entities and statuses',
				undefined,
				{
					validAtTime,
					collectionName: 'posts',
					normalizedEntities: {
						posts: {
							1: {
								id: 1,
							},
						},
					},
				},
				{
					toInclude: {
						collections: {
							posts: {
								1: {
									id: 1,
								},
							},
						},
						statuses: {
							posts: {
								1: {
									validAtTime,
									transient: false,
									persisting: false,
								},
							},
						},
					}
				}
			],
			[
				'replace transient entity',
				{
					collections: {
						posts: {
							[transientId]: {
								id: transientId,
							},
						},
					},
					statuses: {
						posts: {
							[transientId]: {
								transient: true,
								persisting: true,
							},
						},
					},
					errors: {},
				},
				{
					validAtTime,
					collectionName: 'posts',
					normalizedEntities: {
						posts: {
							1: {
								id: 1,
							},
						},
					},
					transientEntityId: transientId,
				},
				{
					toInclude: {
						statuses: {
							posts: {
								1: {
									validAtTime,
									transient: false,
									persisting: false,
								},
							},
						},
					}
				}
			]
		]
	);

	itha(
		reducer,
		RECEIVE_PERSIST_ENTITY_FAILURE,
		[
			[
				'set proper statuses and error',
				undefined,
				{
					collectionName: 'posts',
					entityId: '1',
					error: notFoundError,
				},
				{
					toInclude: {
						statuses: {
							posts: {
								1: {
									transient: false,
									persisting: false,
								},
							},
						},
						errors: {
							posts: {
								1: notFoundError,
							},
						},
					}
				}
			]
		]
	);

});
