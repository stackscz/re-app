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
import type { DefinitionsDictionary } from 'types/DefinitionsDictionary';
import type { NormalizedEntityDictionary } from 'types/NormalizedEntityDictionary';
type NormalizationResult = {
	entities:NormalizedEntityDictionary,
	result:EntityId|Array<EntityId>,
}

/**
 * Normalizes object or array of objects using `normalizr` according to definitions
 *
 * @param {Entity | Array<Entity>} obj value to normalize
 * @param {CollectionName} modelName name of collection of object(s)
 * @param {DefinitionsDictionary} definitions
 * @returns {{entities:NormalizedEntityDictionary, result:EntityId|Array<EntityId>}|*}
 */
export default function normalize(obj:Entity | Array<Entity>,
								  modelName:CollectionName,
								  definitions:DefinitionsDictionary):NormalizationResult {
	const normalizrSchema = createNormalizrSchema(modelName, definitions);
	// TODO throw if unknown definition for modelName
	const normalizeMultiple = _.isArray(obj);
	const normalizationResult = normalizrNormalize(
		obj,
		normalizeMultiple ? arrayOf(normalizrSchema) : normalizrSchema,
		{
			assignEntity: (result, propertyName, propertyValue, entity, entityMapping) => {
				const field = _.get(definitions, [entityMapping.getKey(), 'properties', propertyName]);
				if (field) { // assign only if it is known field
					result[propertyName] = propertyValue;
				}
			},
		}
	);

	return normalizationResult;
}
