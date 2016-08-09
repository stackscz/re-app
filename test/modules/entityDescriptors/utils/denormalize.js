/* eslint-disable */

import _ from 'lodash';

import denormalize from 'modules/entityDescriptors/utils/denormalize';
import testCases from './norm-denorm-cases';

describe('modules/entityDescriptors/utils/denormalize', () => {

	_.each(testCases, (testCase, testCaseKey) => {
		const schema = testCase[0];
		const expectedOutput = testCase[1];
		const input = testCase[2].result;
		const entityDictionary = testCase[2].entities;
		it(`denormalizes properly ${testCaseKey}`, () => {
			const denormalizationResult = denormalize(input, schema, entityDictionary, 3);
		});
	});

});
