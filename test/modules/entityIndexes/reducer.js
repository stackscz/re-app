/* eslint-disable */
import _ from 'lodash';
import expect from 'expect';
import itha from 'utils/itHandlesAction';

import reducer from 'modules/entityIndexes/reducer';
import {
	ENSURE_ENTITY_INDEX,
	ATTEMPT_FETCH_ENTITY_INDEX,
	RECEIVE_ENTITY_INDEX,
	RECEIVE_FETCH_ENTITY_INDEX_FAILURE,
} from 'modules/entityIndexes/actions';
import hash from 'object-hash';

const exampleState = {
	indexes: _.keyBy([
		{
			collectionName: 'posts',
			filter: {},
			fetching: false,
			content: [],
		},
		{
			collectionName: 'posts',
			filter: {
				limit: 10,
			},
			fetching: false,
			content: [],
		},
	], ({ collectionName, filter }) => hash({ collectionName, filter })),
};

describe('modules/entityIndexes/reducer', () => {

	const eeiPayload = {
		collectionName: 'posts',
		filter: { where: { parentId: '10' } },
	};

	itha(
		reducer,
		ENSURE_ENTITY_INDEX,
		[
			[
				'ensure index first time',
				undefined,
				eeiPayload,
				{
					toEqual: {
						indexes: {
							[hash(eeiPayload)]: {
								collectionName: eeiPayload.collectionName,
								filter: eeiPayload.filter,
								fetching: false,
								error: undefined,
							}
						},
						existingCounts: {},
						limit: 20,
					}
				}
			],
			[
				'ensure existing index',
				{
					indexes: {
						[hash(eeiPayload)]: {
							collectionName: eeiPayload.collectionName,
							filter: eeiPayload.filter,
							fetching: true,
							content: ['1', '2', '3'],
							error: undefined,
						}
					},
					existingCounts: {},
					limit: 20,
				},
				eeiPayload,
				{
					toEqual: {
						indexes: {
							[hash(eeiPayload)]: {
								collectionName: eeiPayload.collectionName,
								filter: eeiPayload.filter,
								fetching: true,
								content: ['1', '2', '3'],
								error: undefined,
							}
						},
						existingCounts: {},
						limit: 20,
					}
				}
			],
		]
	);

	itha(
		reducer,
		ATTEMPT_FETCH_ENTITY_INDEX,
		[
			[
				'nonexisting index',
				exampleState,
				{
					indexHash: hash({ collectionName: 'unknowns', filter: {} }),
				},
				{
					toEqual: exampleState,
				},
			],
			[
				'existing index',
				exampleState,
				{
					indexHash: hash({ collectionName: 'posts', filter: {} }),
				},
				{
					toInclude: {
						indexes: {
							[hash({ collectionName: 'posts', filter: {} })]: {
								fetching: true,
							},
						},
					},
				},
			],
		]
	);

	const actionTime = 'someactiontime';
	itha(
		reducer,
		RECEIVE_ENTITY_INDEX,
		[
			[
				'nonexisting index',
				exampleState,
				{
					indexHash: hash({ collectionName: 'unknowns', filter: {} }),
					content: ['1', '2', '3'],
					existingCount: 10,
					validAtTime: 'hbjjnkbhv',
				},
				{
					toNotInclude: {
						indexes: {
							[hash({ collectionName: 'unknowns', filter: {} })]: {}
						}
					}
				}
			],
			[
				'existing index',
				exampleState,
				{
					indexHash: hash({ collectionName: 'posts', filter: {} }),
					content: ['1', '2', '3'],
					existingCount: 10,
					validAtTime: actionTime,
				},
				{
					toInclude: {
						indexes: {
							[hash({ collectionName: 'posts', filter: {} })]: {
								content: ['1', '2', '3'],
								validAtTime: actionTime,
							}
						}
					}
				}
			]
		]
	);

	const notFoundError = {
		code: 404,
		message: 'Not found'
	};

	itha(
		reducer,
		RECEIVE_FETCH_ENTITY_INDEX_FAILURE,
		[
			[
				'unknown index',
				undefined,
				{
					indexHash: hash({ collectionName: 'posts', filter: {} }),
					error: notFoundError
				},
				{
					toNotInclude: {
						indexes: {
							[hash({ collectionName: 'posts', filter: {} })]: {}
						}
					}
				}
			],
			[
				'known index',
				exampleState,
				{
					indexHash: hash({ collectionName: 'posts', filter: {} }),
					error: notFoundError
				},
				{
					toInclude: {
						indexes: {
							[hash({ collectionName: 'posts', filter: {} })]: {
								error: notFoundError
							}
						}
					}
				}
			]
		]
	);

});
