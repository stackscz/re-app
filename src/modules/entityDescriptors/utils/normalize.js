// @flow
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import isObject from 'lodash/isObject';
import dereferenceSchema from './dereferenceSchema';
import type { EntityId } from 'types/EntityId';
import type { JsonSchema } from 'types/JsonSchema';
import type { NormalizedEntityDictionary } from 'types/NormalizedEntityDictionary';
type NormalizationResult = {
	entities: NormalizedEntityDictionary,
	result: EntityId|Array<EntityId>,
}

const findIdPropName = _.memoize(function findIdPropName(schema) {
	const idPropName = _.get(schema, 'x-idPropertyName');
	if (!idPropName) {
		const allOf = _.get(schema, 'allOf');
		if (allOf) {
			return _.reduce(allOf, (resultingIdPropName, partialSchema) => {
				if (resultingIdPropName) {
					return resultingIdPropName;
				}
				return findIdPropName(partialSchema);
			}, undefined);
		}
	}
	return idPropName;
});

const hasOwnSchemaProperty = function hasOwnSchemaProperty(schema, propertyName) {
	return !!_.get(schema, ['properties', propertyName]);
};

function assignEntity(normalized, key, entity, obj, schema) {
	if (hasOwnSchemaProperty(schema, key)) {
		normalized[key] = entity;
	}
}

function visitObject(obj, schema, bag) {
	// console.log('VISITING OBJECT', obj);
	const normalized = {};
	_.each(obj, (value, key) => {
		// console.log('FOR KEY:', key, 'FOUND SCHEMA:', findSchemaForProperty(schema, key));
		const propertySchema = _.get(schema, ['properties', key]);
		// console.log('VISIT', obj[key], propertySchema);
		const entity = visit(obj[key], propertySchema, bag); // eslint-disable-line
		// console.log('RESULT', entity);
		assignEntity(normalized, key, entity, obj, schema);
	});
	return normalized;
}

function mergeIntoEntity(entityA, entityB, modelName) {
	_.each(entityB, (value, key) => {
		if (!entityB.hasOwnProperty(key)) {
			return;
		}

		if (!entityA.hasOwnProperty(key) || _.isEqual(entityA[key], entityB[key])) {
			entityA[key] = entityB[key];
			return;
		}

		console.warn(
			`When merging two ${modelName}, 
			found unequal data in their "${key}" values. 
			Using the earlier value.`,
			entityA[key], entityB[key]
		);
	});
}

function visitEntity(obj, schema, bag) {
	const modelName = _.get(schema, 'x-model');
	// console.log('VISITING ENTITY', modelName, obj);
	const idPropertyName = findIdPropName(schema);
	const id = _.get(obj, idPropertyName);

	if (!bag.hasOwnProperty(modelName)) {
		bag[modelName] = {};
	}

	if (!bag[modelName].hasOwnProperty(id)) {
		bag[modelName][id] = {};
	}

	const stored = bag[modelName][id];
	let normalized = visitObject(obj, schema, bag);
	// console.log('NORMALIZED', schema, normalized);
	mergeIntoEntity(stored, normalized, modelName);

	// is it composite entity?
	const allOf = _.get(schema, 'allOf');
	if (_.isArray(allOf)) {
		_.each(allOf, (composedSchema) => {
			const composedSchemaModelName = _.get(composedSchema, 'x-model');
			if (composedSchemaModelName) {
				visitEntity(obj, composedSchema, bag);
			} else {
				// visit(obj, composedSchema, bag);
				normalized = visitObject(obj, composedSchema, bag);
				mergeIntoEntity(stored, normalized, modelName);
			}
		});
	}

	const mappedBy = _.get(schema, 'x-mappedBy');
	if (mappedBy) {
		const fk = mappedBy;
		console.log(fk);
		// if(entitySchema[fk] instanceof IterableSchema && parentId) {
		// 	if(!stored[fk]) {
		// 		stored[fk] = [];
		// 	}
		// 	stored[fk] = Array.from(new Set([
		// 		...stored[fk],
		// 		parentId
		// 	]));
		// } else if (parentId && !stored[fk]) {
		// 	stored[fk] = parentId;
		// }
	}

	return id;
}

function visitArray(obj, schema, bag) {
	// console.log('VISITING ARRAY', obj, schema);
	const itemSchema = _.get(schema, 'items');
	// eslint-disable-next-line no-use-before-define
	return obj.map((item) => visit(item, itemSchema, bag));
}

function visit(obj, schema, bag, parentId) {
	if (!isObject(obj) || !isObject(schema)) {
		return obj;
	}
	// console.log('VISITING', obj, schema);

	const type = _.get(schema, 'type', 'object');
	const modelName = _.get(schema, 'x-model');

	if (modelName && type === 'object') {
		// if it is an object schema and has x-model, it is entity schema
		return visitEntity(obj, schema, bag);
	} else if (type === 'array') {
		// array schema
		return visitArray(obj, schema, bag);
	} else if (type === 'object') {
		return obj;
	}
	// value schema
	return visitObject(obj, schema, bag, parentId);
}

/**
 * Normalizes value according to json schema
 *
 * @param {Entity | Array<Entity>} obj value to normalize
 * @param {JsonSchema} schema to normalize value by
 * @returns {{entities:NormalizedEntityDictionary, result:EntityId|Array<EntityId>}|*}
 */
export default function normalize(obj:any,
								  schema:JsonSchema):NormalizationResult {
	const dereferencedSchema = dereferenceSchema(schema);
	const bag = {};
	const result = visit(obj, dereferencedSchema, bag);
	return {
		result,
		entities: bag,
	};
}
