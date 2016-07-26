/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';
import t from 'tcomb';

import isOfType from 'utils/isOfType';

describe('utils/isOfType', () => {

	const testCasesToFail = [
		[
			1000,
			t.String,
		],
		[
			'foo',
			t.Number,
		],
		[
			{
				foo: 'bar',
			},
			t.struct({
				bar: t.Number,
			}),
		],
	];

	_.each(testCasesToFail, (testCase) => {
		it('should return false when value is of invalid type', () => {
			expect(isOfType(testCase[0], testCase[1])).toEqual(false);
		});
	});


	const testCasesToSucceed = [
		[
			'foo',
			t.String,
		],
		[
			1000,
			t.Number,
		],
		[
			{
				bar: 10,
			},
			t.struct({
				bar: t.Number,
			}),
		],
	];

	_.each(testCasesToSucceed, (testCase) => {
		it('should return true when value is of valid type', () => {
			expect(isOfType(testCase[0], testCase[1])).toEqual(true);
		});
	});

	it('should throw when invalid type supplied', () => {
		expect(() => {
			isOfType(
				'foo',
				'invalid type'
			);
		}).toThrow(/must be tcomb type/);
	});

});
