/* eslint-disable no-param-reassign */
import _ from 'lodash';
import createNormalizrSchema from './createNormalizrSchema';
import {
	normalize as normalizrNormalize,
	arrayOf,
} from 'normalizr';
import type Entity from 'types/Entity';
import type EntityId from 'types/EntityId';
import type CollectionName from 'types/CollectionName';
import type SchemasDictionary from 'types/SchemasDictionary';
import type NormalizedEntityDictionary from 'types/NormalizedEntityDictionary';
type NormalizationResult = {
	entities:NormalizedEntityDictionary,
	result:EntityId|Array<EntityId>,
}

/**
 * Normalizes object or array of objects using `normalizr` according to schemas
 *
 * @param {Entity | Array<Entity>} obj value to normalize
 * @param {CollectionName} collectionName name of collection of object(s)
 * @param {SchemasDictionary} schemas
 * @returns {{entities:NormalizedEntityDictionary, result:EntityId|Array<EntityId>}|*}
 */
export default function normalize(obj:Entity | Array<Entity>,
								  collectionName:CollectionName,
								  schemas:SchemasDictionary):NormalizationResult {
	const normalizrSchema = createNormalizrSchema(collectionName, schemas);
	// TODO throw if unknown schema for collectionName
	const normalizeMultiple = _.isArray(obj);
	const normalizationResult = normalizrNormalize(
		obj,
		normalizeMultiple ? arrayOf(normalizrSchema) : normalizrSchema,
		{
			assignEntity: (result, propertyName, propertyValue, entity, entityMapping) => {
				const field = _.get(schemas, [entityMapping.getKey(), 'fields', propertyName]);
				if (field) { // assign only if it is known field
					result[propertyName] = propertyValue;
					if (propertyName === entityMapping.getIdAttribute()) {
						result[propertyName] = `${result[propertyName]}`;
					}
				}
			},
			// TODO rethink leaving of warnings
			//	,
			//	mergeIntoEntity: (entityA, entityB, entityKey) => {
			//		debugger;
			//
			//		for (let key in entityB) {
			//			if (!entityB.hasOwnProperty(key)) {
			//				continue;
			//			}
			//
			//			if (!entityA.hasOwnProperty(key) || isEqual(entityA[key], entityB[key])) {
			//				entityA[key] = entityB[key];
			//				continue;
			//			}
			//
			//			if(schema[key] && schema[key].type === 'association' && )
			//
			//			console.warn(
			//				'When merging two ' +
			// 				entityKey +
			// 				', found unequal data in their "' +
			// 				key +
			// 				'" values. Using the earlier value.',
			//				entityA[key], entityB[key]
			//			);
			//		}
			//	}
		}
	);

	if (normalizeMultiple) {
		normalizationResult.result = _.map(normalizationResult.result, (id) => `${id}`);
	} else {
		normalizationResult.result = `${normalizationResult.result}`;
	}

	return normalizationResult;
}
