// @flow
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import createNormalizrSchema from './createNormalizrSchema';
import {
	normalize as normalizrNormalize,
	arrayOf,
} from 'normalizr';
import type { Entity } from 'types/Entity';
import type { EntityId } from 'types/EntityId';
import type { CollectionName } from 'types/CollectionName';
import type { SchemasDictionary } from 'types/SchemasDictionary';
import type { NormalizedEntityDictionary } from 'types/NormalizedEntityDictionary';
type NormalizationResult = {
	entities:NormalizedEntityDictionary,
	result:EntityId|Array<EntityId>,
}

/**
 * Normalizes object or array of objects using `normalizr` according to schemas
 *
 * @param {Entity | Array<Entity>} obj value to normalize
 * @param {CollectionName} modelName name of collection of object(s)
 * @param {SchemasDictionary} schemas
 * @returns {{entities:NormalizedEntityDictionary, result:EntityId|Array<EntityId>}|*}
 */
export default function normalize(obj:Entity | Array<Entity>,
								  modelName:CollectionName,
								  schemas:SchemasDictionary):NormalizationResult {
	const normalizrSchema = createNormalizrSchema(modelName, schemas);
	// TODO throw if unknown schema for modelName
	const normalizeMultiple = _.isArray(obj);
	const normalizationResult = normalizrNormalize(
		obj,
		normalizeMultiple ? arrayOf(normalizrSchema) : normalizrSchema,
		{
			assignEntity: (result, propertyName, propertyValue, entity, entityMapping) => {
				const field = _.get(schemas, [entityMapping.getKey(), 'fields', propertyName]);
				if (field) { // assign only if it is known field
					result[propertyName] = propertyValue;
				}
			},
		}
	);

	return normalizationResult;
}
