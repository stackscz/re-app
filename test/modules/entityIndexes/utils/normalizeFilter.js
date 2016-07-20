/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';
import normalizeFilter from 'modules/entityIndexes/utils/normalizeFilter';

describe('modules/entityIndexes/utils/normalizeFilter', () => {

	const testCases = [
		[
			undefined,
			{
				order: [
					'id'
				],
				offset: 0,
				limit: -1,
			},
		],
		[
			{},
			{
				order: [
					'id'
				],
				offset: 0,
				limit: -1,
			}
		],
		[
			{
				limit: 100,
			},
			{
				order: [
					'id'
				],
				offset: 0,
				limit: 100,
			}
		],
		[
			{
				offset: 50,
				limit: 100,
			},
			{
				order: [
					'id'
				],
				offset: 50,
				limit: 100,
			}
		],
		[
			{
				order: [
					'name'
				],
			},
			{
				order: [
					'name'
				],
				offset: 0,
				limit: -1,
			}
		],
		[
			{
				order: [
					'name',
					'-title',
				],
			},
			{
				order: [
					'name',
					'-title',
				],
				offset: 0,
				limit: -1,
			}
		],
		[
			{
				order: [
					'-name',
					'title',
				],
				where: {
					title: 'foobar'
				},
			},
			{
				order: [
					'-name',
					'title',
				],
				offset: 0,
				limit: -1,
				where: {
					title: 'foobar',
				},
			},
		],
	];

	_.each(testCases, (testCase, index) => {
		it(`overwrites and merges properly ${index + 1}`, () => {
			const inputFilter = testCase[0];
			const expectedFilter = testCase[1];
			const result = normalizeFilter(inputFilter);
			expect(result).toEqual(expectedFilter);
		});
	});

});
