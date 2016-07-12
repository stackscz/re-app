// @flow
import _ from 'utils/lodash';
import invariant from 'invariant';
import type { SchemasDictionary } from 'types/SchemasDictionary';
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
export default function createNormalizrSchema(collectionName:string, schemas:SchemasDictionary) {
	invariant(schemas[collectionName], 'Unknown collection %s', JSON.stringify(collectionName));

	if (!_.get(schemas, collectionName)) {
		return undefined;
	}

	if (cachedSchemas !== schemas) {
		cachedSchemas = schemas;
		mappings = {};

		// create normalizr schemas
		_.each(cachedSchemas, (schema, cachedCollectionName) => {
			mappings[cachedCollectionName] = new Schema(
				cachedCollectionName,
				{ idAttribute: schema.idFieldName }
			);
		});

		// define normalizr schemas
		_.each(cachedSchemas, (schema) => {
			_.each(schema.fields, (field) => {
				if (field.type === 'association') {
					const assocMapping = mappings[field.collectionName];
					mappings[schema.name].define({
						[field.name]: field.isMultiple ? arrayOf(assocMapping) : assocMapping,
					});
				}
			});
		});
	}


	return mappings[collectionName];
}
