/* eslint-disable */
import _ from 'utils/lodash';
import invariant from 'invariant';
import typeInvariant from 'utils/typeInvariant';
import {
	SchemasDictionary,
	EntityAssociationFieldSchema,
} from '../types';
import { Schema, arrayOf } from 'normalizr';

let cachedSchemas;
let mappings = {};

/**
 * Generates `normalizr` schemas from internal schemas
 *
 * @param {string} collectionName
 * @param {SchemasDictionary} schemas
 * @returns {Schema} normalizr schema for collection
 */
export default function createNormalizrSchema(collectionName, schemas) {
	// TODO memoize
	invariant(_.isString(collectionName), '%s is not valid collection name', JSON.stringify(collectionName));
	typeInvariant(schemas, SchemasDictionary, 'Invalid schemas dictionary supplied to createNormalizrSchema');
	invariant(schemas[collectionName], 'Unknown collection %s', JSON.stringify(collectionName));

	if (!_.get(schemas, collectionName)) {
		return undefined;
	}

	if (cachedSchemas !== schemas) {
		cachedSchemas = schemas;
		mappings = {};

		// create normalizr schemas
		_.each(cachedSchemas, (schema, collectionName) => {
			mappings[collectionName] = new Schema(collectionName, { idAttribute: schema.idFieldName });
		});

		// define normalizr schemas
		_.each(cachedSchemas, (schema) => {
			_.each(schema.fields, (field) => {
				if (field.type === 'association') {
					const assocMapping = mappings[field.collectionName];
					mappings[schema.name].define({
						[field.name]: field.isMultiple ? arrayOf(assocMapping) : assocMapping
					});
				}
			});
		});
	}


	return mappings[collectionName];
}
