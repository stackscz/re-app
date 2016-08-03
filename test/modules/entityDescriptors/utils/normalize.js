/* eslint-disable */

import expect from 'expect';
import Immutable from 'seamless-immutable';

import createNormalizrSchema from 'modules/entityDescriptors/utils/createNormalizrSchema';
import normalize from 'modules/entityDescriptors/utils/normalize';

import schemas from './data/schemas';

const invalidSchemas = {
	posts: {}
};

describe('modules/entityDescriptors/utils/normalize', () => {

	const objToNormalize = {
		id: 1,
		title: 'Some post',
		tags: [
			{
				name: 'tag-1',
			},
			{
				name: 'tag-2',
			},
		],
	};

	const arrayToNormalize = [
		{
			id: 1,
			title: 'Some post',
			tags: [
				{
					name: 'tag-1',
				},
				{
					name: 'tag-2',
				},
			],
		},
		{
			id: 2,
			title: 'Some post 2',
			tags: [
				{
					name: 'tag-3',
				},
			],
		},
	];

	describe('should throw when called with bad params', () => {

		it('should throw when called without params', () => {
			expect(() => {
				normalize();
			}).toThrow(/Invalid value/)
		});

		it('should throw when unknown collection', () => {
			expect(() => {
				normalize({}, 'cats', schemas);
			}).toThrow(/Unknown collection/);
		});

		it('should throw when invalid schemas dictionary', () => {
			expect(() => {
				normalize({}, 'posts', invalidSchemas);
			}).toThrow(/Invalid value/);
		});

	});

	describe('should normalize properly', () => {

		it('should normalize single object', () => {
			const normalizationResult = normalize(objToNormalize, 'posts', schemas);
			expect(normalizationResult).toEqual({
				result: 1,
				entities: {
					posts: {
						1: {
							id: 1,
							title: 'Some post',
							tags: [
								'tag-1',
								'tag-2',
							],
						},
					},
					tags: {
						'tag-1': {
							name: 'tag-1',
						},
						'tag-2': {
							name: 'tag-2',
						},
					},
				},
			});
		});

		it('should normalize array of objects', () => {
			const normalizationResult = normalize(arrayToNormalize, 'posts', schemas);
			expect(normalizationResult).toEqual({
				result: [1, 2],
				entities: {
					posts: {
						1: {
							id: 1,
							title: 'Some post',
							tags: [
								'tag-1',
								'tag-2',
							],
						},
						2: {
							id: 2,
							title: 'Some post 2',
							tags: [
								'tag-3',
							],
						},
					},
					tags: {
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
				},
			});
		});


		it('should strip unknown properties', () => {
			const objectWithAdditionalProps = {
				id: 1,
				title: 'Some post',
				additional: 'prop',
				tags: [
					{
						name: 'tag-1',
						some: 'garbage',
					},
					{
						name: 'tag-2',
					},
				],
			};

			const normalizationResult = normalize(objectWithAdditionalProps, 'posts', schemas);
			expect(normalizationResult).toEqual({
				result: 1,
				entities: {
					posts: {
						1: {
							id: 1,
							title: 'Some post',
							tags: [
								'tag-1',
								'tag-2',
							],
						},
					},
					tags: {
						'tag-1': {
							name: 'tag-1',
						},
						'tag-2': {
							name: 'tag-2',
						},
					},
				},
			});
		});

	});

});
