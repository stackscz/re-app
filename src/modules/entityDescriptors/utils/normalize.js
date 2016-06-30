/* eslint-disable */
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import invariant from 'invariant';
import createNormalizrSchema from './createNormalizrSchema';
import {
	normalize as normalizrNormalize,
	Schema,
	arrayOf,
} from 'normalizr';

/**
 * Normalizes object or array of objects using `normalizr` according to schemas
 *
 * @param {object|array} obj value to normalize
 * @param {string} collectionName name of collection of object(s)
 * @param {SchemasDictionary} schemas
 * @returns {{entities, result}|*}
 */
export default function normalize(obj, collectionName, schemas) {
	invariant(obj, 'Data object not supplied in "normalize"');
	const normalizrSchema = createNormalizrSchema(collectionName, schemas);
	// TODO throw if unknown schema for collectionName
	const normalizeMultiple = _.isArray(obj);
	const normalizationResult = normalizrNormalize(obj, normalizeMultiple ? arrayOf(normalizrSchema) : normalizrSchema, {
		assignEntity: (obj, propertyName, propertyValue, entity, entityMapping) => {
			const field = _.get(schemas, [entityMapping.getKey(), 'fields', propertyName]);
			if (field) { // assign only if it is known field
				obj[propertyName] = propertyValue;
				if (propertyName === entityMapping.getIdAttribute()) {
					obj[propertyName] = `${obj[propertyName]}`;
				}
			}
		}
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
		//				'When merging two ' + entityKey + ', found unequal data in their "' + key + '" values. Using the earlier value.',
		//				entityA[key], entityB[key]
		//			);
		//		}
		//	}
	});

	if(normalizeMultiple) {
		normalizationResult.result = _.map(normalizationResult.result, (id) => `${id}`);
	} else {
		normalizationResult.result = `${normalizationResult.result}`;
	}

	return normalizationResult;
}
