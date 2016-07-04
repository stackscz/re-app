/* eslint-disable */
import expect from 'expect';
import isEqualWith from 'lodash/isEqualWith';
import isFunction from 'lodash/isFunction';
import Immutable from 'seamless-immutable';

import { Schema, arrayOf } from 'normalizr';
import createNormalizrSchema from 'modules/entityDescriptors/utils/createNormalizrSchema';

import schemas from './data/schemas';

function areSchemasEqual(a, b) {
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
		}).toThrow(/collectionName/);
		expect(() => {
			createNormalizrSchema('items');
		}).toThrow(/SchemasDictionary/);
	});

	it('should check type of schemas', () => {
		expect(() => {
			createNormalizrSchema('posts', { some: 'invalidSchemasDictionary' });
		}).toThrow(/SchemasDictionary/);
	});

	const expectedNormalizrSchemas = {
		posts: new Schema('posts'),
		tags: new Schema('tags', { idAttribute: 'name' }),
		users: new Schema('users'),
	};
	expectedNormalizrSchemas.posts.define({
		author: expectedNormalizrSchemas.users,
		tags: arrayOf(expectedNormalizrSchemas.tags),
	});
	expectedNormalizrSchemas.tags.define({
		posts: arrayOf(expectedNormalizrSchemas.posts),
	});
	expectedNormalizrSchemas.users.define({
		articles: arrayOf(expectedNormalizrSchemas.posts),
	});

	it('should create valid normalizr schema from re-app schemas', () => {
		expect(
			areSchemasEqual(
				createNormalizrSchema('posts', schemas),
				expectedNormalizrSchemas.posts
			)
		).toBe(true, 'resulting schema is invalid for posts');
		expect(
			areSchemasEqual(
				createNormalizrSchema('tags', schemas),
				expectedNormalizrSchemas.tags
			)
		).toBe(true, 'resulting schema is invalid for tags');
		expect(
			areSchemasEqual(
				createNormalizrSchema('users', schemas),
				expectedNormalizrSchemas.users
			)
		).toBe(true, 'resulting schema is invalid for users');

	});


	it('should memoize results', () => {

		const immutableSchemas = Immutable.from(schemas);
		const modifiedImmutableSchemas = immutableSchemas.merge({
			tags: {
				fields: {
					author: {
						name: 'author',
						type: 'association',
						collectionName: 'users',
						isMultiple: false,
					}
				}
			}
		}, { deep: true });
		expectedNormalizrSchemas.tags.define({
			author: expectedNormalizrSchemas.users,
		});

		expect(
			areSchemasEqual(
				createNormalizrSchema('tags', modifiedImmutableSchemas),
				expectedNormalizrSchemas.tags
			)
		).toBe(true, 'resulting schema is invalid for memoized tags');
		expect(
			areSchemasEqual(
				createNormalizrSchema('users', modifiedImmutableSchemas),
				expectedNormalizrSchemas.users
			)
		).toBe(true, 'resulting schema is invalid for memoized users');
		expect(
			areSchemasEqual(
				createNormalizrSchema('posts', modifiedImmutableSchemas),
				expectedNormalizrSchemas.posts
			)
		).toBe(true, 'resulting schema is invalid for memoized users');

	});

});
