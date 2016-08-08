/* eslint-disable */
import expect from 'expect';
import isEqualWith from 'lodash/isEqualWith';
import isFunction from 'lodash/isFunction';
import Immutable from 'seamless-immutable';

import { Schema, arrayOf } from 'normalizr';
import createNormalizrSchema from 'modules/entityDescriptors/utils/createNormalizrSchema';

import definitions from './data/definitions';

function areDefinitionsEqual(a, b) {
	return isEqualWith(a, b, (objValue) => {
		if (isFunction(objValue)) {
			return true;
		}
	});
}

describe('modules/entityDescriptors/utils/createNormalizrSchema', () => {

	it('should check params', () => {
		expect(() => {
			createNormalizrSchema({ some: 'nonsense' });
		}).toThrow(/modelName/);
		expect(() => {
			createNormalizrSchema('items');
		}).toThrow(/DefinitionsDictionary/);
	});

	it('should check type of definitions', () => {
		expect(() => {
			createNormalizrSchema('Post', { some: 'invalidDefinitionsDictionary' });
		}).toThrow(/DefinitionsDictionary/);
	});

	const expectedNormalizrDefinitions = {
		Post: new Schema('Post'),
		Tag: new Schema('Tag', { idAttribute: 'name' }),
		User: new Schema('User'),
	};
	expectedNormalizrDefinitions.Post.define({
		author: expectedNormalizrDefinitions.User,
		tags: arrayOf(expectedNormalizrDefinitions.Tag),
	});
	expectedNormalizrDefinitions.Tag.define({
		posts: arrayOf(expectedNormalizrDefinitions.Post),
	});
	expectedNormalizrDefinitions.User.define({
		articles: arrayOf(expectedNormalizrDefinitions.Post),
	});

	it('should create valid normalizr schema from re-app definitions', () => {
		expect(
			areDefinitionsEqual(
				createNormalizrSchema('Post', definitions),
				expectedNormalizrDefinitions.Post
			)
		).toBe(true, 'resulting schema is invalid for Post');
		expect(
			areDefinitionsEqual(
				createNormalizrSchema('Tag', definitions),
				expectedNormalizrDefinitions.Tag
			)
		).toBe(true, 'resulting schema is invalid for Tag');
		expect(
			areDefinitionsEqual(
				createNormalizrSchema('User', definitions),
				expectedNormalizrDefinitions.User
			)
		).toBe(true, 'resulting schema is invalid for User');

	});


	it('should memoize results', () => {

		const immutableDefinitions = Immutable.from(definitions);
		const modifiedImmutableDefinitions = immutableDefinitions.merge({
			Tag: {
				properties: {
					author: {
						$ref: '#/definitions/User'
					}
				}
			}
		}, { deep: true });
		expectedNormalizrDefinitions.Tag.define({
			author: expectedNormalizrDefinitions.User,
		});

		expect(
			areDefinitionsEqual(
				createNormalizrSchema('Tag', modifiedImmutableDefinitions),
				expectedNormalizrDefinitions.Tag
			)
		).toBe(true, 'resulting schema is invalid for memoized Tag');
		expect(
			areDefinitionsEqual(
				createNormalizrSchema('User', modifiedImmutableDefinitions),
				expectedNormalizrDefinitions.User
			)
		).toBe(true, 'resulting schema is invalid for memoized User');
		expect(
			areDefinitionsEqual(
				createNormalizrSchema('Post', modifiedImmutableDefinitions),
				expectedNormalizrDefinitions.Post
			)
		).toBe(true, 'resulting schema is invalid for memoized User');

	});

});
