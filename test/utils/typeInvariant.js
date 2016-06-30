/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';
import t from 'tcomb';

import typeInvariant from 'utils/typeInvariant';

describe('utils/typeInvariant', () => {

	const testCasesToFail = [
		[
			1000,
			t.String,
		],
		[
			'foo',
			t.Number,
		],
	];

	_.each(testCasesToFail, (testCase) => {
		it('should throw when value is of invalid type', () => {
			expect(() => {
				typeInvariant(testCase[0], testCase[1]);
			}).toThrow(/Type validation failed/);
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
	];

	_.each(testCasesToSucceed, (testCase) => {
		it('should not throw when value is of valid type', () => {
			expect(() => {
				typeInvariant(testCase[0], testCase[1]);
			}).toNotThrow();
		});
	});

	it('should produce proper message', () => {
		const entity = 'value';
		expect(() => {
			typeInvariant(
				entity,
				t.Object,
				'Entity should be an object, %s supplied. %s, %s',
				JSON.stringify(entity),
				'yadda',
				'badda'
			);
		}).toThrow(/Entity should be an object, "value" supplied. yadda, badda/);
	});

	it('should throw when invalid type supplied', () => {
		expect(() => {
			typeInvariant(
				'foo',
				'invalid type'
			);
		}).toThrow(/must be tcomb type/);
	});

});
