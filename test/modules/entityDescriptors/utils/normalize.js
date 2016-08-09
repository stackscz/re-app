/* eslint-disable */

import _ from 'lodash';
import expect from 'expect';
import Immutable from 'seamless-immutable';

import normalize from 'modules/entityDescriptors/utils/normalize';
import testCases from './norm-denorm-cases';

describe('modules/entityDescriptors/utils/normalize', () => {

	_.each(testCases, (testCase, testCaseKey) => {
		const schema = testCase[0];
		const input = testCase[1];
		const expectedOutput = testCase[2];
		it(`normalizes properly ${testCaseKey}`, () => {
			const normalizationResult = normalize(input, schema);
			expect(normalizationResult).toEqual(expectedOutput);
		});
	});

});
