/* eslint-disable */

import expect from 'expect';
import _ from 'lodash';

import { Schema, arrayOf } from 'normalizr';
import createNormalizrSchema from 'modules/entityDescriptors/utils/createNormalizrSchema';
import denormalize from 'modules/entityDescriptors/utils/denormalize';

import definitions from './data/definitions';

const entityDictionary = {
	Post: {
		1: {
			id: '1',
			title: 'Some post',
			tags: [
				'tag-1',
				'tag-2',
			],
			author: '1',
		},
		2: {
			id: '2',
			title: 'Some post 2',
			tags: [
				'tag-3',
			],
			author: '1',
		},
		3: {
			id: '3',
			title: 'Some post 3',
			tags: [
				'tag-1',
			],
			author: '2',
		},
	},
	Tag: {
		'tag-1': {
			name: 'tag-1',
		},
		'tag-2': {
			name: 'tag-2',
		},
		'tag-3': {
			name: 'tag-3',
		},
	},
	User: {
		1: {
			id: '1',
			email: 'john@doe.com',
			articles: ['1', '2'],
		},
		2: {
			id: '2',
			email: 'jane@doe.com',
			articles: ['3'],
		},
	},
};

describe('modules/entityDescriptors/utils/denormalize', () => {

	it('should throw when called with bad params', () => {
		expect(() => {
			denormalize();
		}).toThrow(/Invalid value/);
		expect(() => {
			denormalize([1, 2]);
		}).toThrow(/Invalid value/);
		expect(() => {
			denormalize(['1', '2']);
		}).toThrow(/Invalid value/);
		expect(() => {
			denormalize(['1', '2'], 'Post');
		}).toThrow(/Invalid value/);
		expect(() => {
			denormalize(['1', '2'], 'Post');
		}).toThrow(/Invalid value/);
		expect(() => {
			denormalize(['1', '2'], 'Post', {}, {});
		}).toThrow(/Unknown collection/);
		expect(() => {
			denormalize(['1', '2'], 'foo', entityDictionary, definitions);
		}).toThrow(/Unknown collection/);
		expect(() => {
			denormalize(['1', '2'], 'foo', entityDictionary, {foo: {name:'foo'}});
		// }).toNotThrow();
		}).toThrow(/DefinitionsDictionary/);
	});

	describe('should denormalize single entity properly', () => {
		const expectedResult = {
			id: '1',
			title: 'Some post',
			tags: [
				{
					name: 'tag-1',
				},
				{
					name: 'tag-2',
				},
			],
			author: {
				id: '1',
				email: 'john@doe.com',
				articles: ['1', '2'],
			},
		};

		it('should denormalize properly with entity id', () => {
			const denormalizationResult = denormalize('1', 'Post', entityDictionary, definitions);
			expect(denormalizationResult).toEqual(expectedResult);
		});
		it('should denormalize properly with entity object', () => {
			const denormalizationResult = denormalize({ id: '1' }, 'Post', entityDictionary, definitions);
			expect(denormalizationResult).toEqual(expectedResult);
		});
		it('should denormalize properly with maxLevel > 1', () => {

			let circularExpectedResult = _.merge(
				{},
				_.omit(expectedResult, ['author.articles'])
			);
			circularExpectedResult.author.articles = [
				circularExpectedResult,
				{
					id: '2',
					title: 'Some post 2',
					tags: ['tag-3'],
					author: '1',
				}
			];

			const denormalizationResult = denormalize('1', 'Post', entityDictionary, definitions, 2);
			expect(_.isEqual(denormalizationResult, circularExpectedResult)).toBe(true);

		});
	});

	describe('should denormalize array of entities properly', () => {
		const expectedResult = [
			{
				id: '1',
				title: 'Some post',
				tags: [
					{
						name: 'tag-1',
					},
					{
						name: 'tag-2',
					},
				],
				author: {
					id: '1',
					email: 'john@doe.com',
					articles: ['1', '2'],
				},
			},
			{
				id: '3',
				title: 'Some post 3',
				tags: [
					{
						name: 'tag-1',
					},
				],
				author: {
					id: '2',
					email: 'jane@doe.com',
					articles: ['3'],
				},
			}
		];

		it('should denormalize properly with entity ids array', () => {
			const denormalizationResult = denormalize(['1', '3'], 'Post', entityDictionary, definitions);
			expect(denormalizationResult).toEqual(expectedResult);
		});

		it('should denormalize properly with entity objects array', () => {
			const denormalizationResult = denormalize([{ id: '1' }, { id: '3' }], 'Post', entityDictionary, definitions);
			expect(denormalizationResult).toEqual(expectedResult);
		});
	});

});
