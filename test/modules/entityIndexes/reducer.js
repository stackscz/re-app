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
			modelName: 'posts',
			filter: {},
			fetching: false,
			content: [],
		},
		{
			modelName: 'posts',
			filter: {
				limit: 10,
			},
			fetching: false,
			content: [],
		},
	], ({ modelName, filter }) => hash({ modelName, filter })),
};

describe('modules/entityIndexes/reducer', () => {

	const indexSpec = {
		modelName: 'posts',
		filter: { where: { parentId: '10' } },
	};

	itha(
		reducer,
		ENSURE_ENTITY_INDEX,
		[
			[
				'ensure index first time',
				undefined,
				{
					...indexSpec,
					force: false,
				},
				{
					toEqual: {
						indexes: {
							[hash(indexSpec)]: {
								modelName: indexSpec.modelName,
								filter: indexSpec.filter,
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
						[hash(indexSpec)]: {
							modelName: indexSpec.modelName,
							filter: indexSpec.filter,
							fetching: true,
							content: ['1', '2', '3'],
							error: undefined,
						}
					},
					existingCounts: {},
					limit: 20,
				},
				{
					...indexSpec,
					force: false,
				},
				{
					toEqual: {
						indexes: {
							[hash(indexSpec)]: {
								modelName: indexSpec.modelName,
								filter: indexSpec.filter,
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
					indexHash: hash({ modelName: 'unknowns', filter: {} }),
				},
				{
					toEqual: exampleState,
				},
			],
			[
				'existing index',
				exampleState,
				{
					indexHash: hash({ modelName: 'posts', filter: {} }),
				},
				{
					toInclude: {
						indexes: {
							[hash({ modelName: 'posts', filter: {} })]: {
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
					indexHash: hash({ modelName: 'unknowns', filter: {} }),
					content: ['1', '2', '3'],
					existingCount: 10,
					validAtTime: 'hbjjnkbhv',
				},
				{
					toNotInclude: {
						indexes: {
							[hash({ modelName: 'unknowns', filter: {} })]: {}
						}
					}
				}
			],
			[
				'existing index',
				exampleState,
				{
					indexHash: hash({ modelName: 'posts', filter: {} }),
					content: ['1', '2', '3'],
					existingCount: 10,
					validAtTime: actionTime,
				},
				{
					toInclude: {
						indexes: {
							[hash({ modelName: 'posts', filter: {} })]: {
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
					indexHash: hash({ modelName: 'posts', filter: {} }),
					error: notFoundError
				},
				{
					toNotInclude: {
						indexes: {
							[hash({ modelName: 'posts', filter: {} })]: {}
						}
					}
				}
			],
			[
				'known index',
				exampleState,
				{
					indexHash: hash({ modelName: 'posts', filter: {} }),
					error: notFoundError
				},
				{
					toInclude: {
						indexes: {
							[hash({ modelName: 'posts', filter: {} })]: {
								error: notFoundError
							}
						}
					}
				}
			]
		]
	);

});
