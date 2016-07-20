/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';
import {
	getDynamicEntityIndexContentSelector,
} from 'modules/entityIndexes/selectors';

describe('modules/entityIndexes/selectors/getDynamicEntityIndexContentSelector', () => {

	it('returns undefined for unknown index', () => {
		const emptyState = {};
		expect(getDynamicEntityIndexContentSelector('unknown')(emptyState)).toBe(undefined);
	});

	it('returns unmodified index when unknown collection', () => {
		const expectedContent = ['1', '2', '3'];
		const noCollectionsState = {
			entityIndexes: {
				indexes: {
					idxid: {
						collectionName: 'posts',
						content: expectedContent,
					}
				}
			}
		};
		expect(getDynamicEntityIndexContentSelector('idxid')(noCollectionsState)).toBe(expectedContent);
	});


	const indexHash = 'nbhj45b32jk543b2k';
	const state = {
		entityIndexes: {
			indexes: {
				[indexHash]: {
					collectionName: 'posts',
					filter: undefined,
					content: ['1', '2', '4'],
				}
			},
		},
		entityStorage: {
			collections: {
				posts: {
					1: {
						id: '1',
						parent: '10',
						title: 'Title 1',
					},
					2: {
						id: '2',
						parent: '10',
						title: 'Title 2',
					},
					3: {
						id: '3',
						parent: '20',
						title: 'Title 3',
					},
					4: {
						id: '4',
						parent: '10',
						title: 'Title 4',
					},
					transient1: {
						id: 'transient1',
						parent: '20',
						title: 'B Title k4j4k3543',
					},
					transient2: {
						id: 'transient2',
						parent: '10',
						title: 'A Title k4j4k3543',
					},
				}
			}
		}
	};

	const testCases = [
		[
			{
				where: {
					parent: '10'
				}
			},
			['1', '2', '4'],
			['1', '2', '4', 'transient2'],
		],
		[
			{
				order: [
					'-id'
				],
				where: {
					parent: '10'
				}
			},
			['1', '2', '4'],
			['transient2', '4', '2', '1'],
		],
		[
			{
				order: [
					'-id'
				],
				where: {
					parent: '20'
				}
			},
			['3'],
			['transient1', '3'],
		],
		[
			{
				order: [
					'parent',
					'-title',
				]
			},
			[],
			['4', '2', '1', 'transient2', '3', 'transient1']
		],
	];

	_.each(testCases, (testCase, index) => {
		it(`selects properly filtered and ordered index - ${index + 1}`, () => {
			state.entityIndexes.indexes[indexHash].filter = testCase[0];
			state.entityIndexes.indexes[indexHash].content = testCase[1];
			const expectedIndex = testCase[2];
			const result = getDynamicEntityIndexContentSelector(indexHash)(state);
			expect(result).toEqual(expectedIndex);
		});
	});

});
