// @flow
/* eslint-disable no-use-before-define, no-param-reassign */
import _, { merge } from 'lodash';
// import { isImmutable, setIn, getIn } from './immutableUtils';
import { setIn } from './immutableUtils';
import type { JsonSchema } from 'types/JsonSchema';
import type { Entity } from 'types/Entity';
import type { NormalizedEntityDictionary } from 'types/NormalizedEntityDictionary';

function resolveEntityOrId(entityOrId, schema, entityDictionary) {
	const idPropertyName = _.get(schema, 'x-idPropertyName');
	const modelName = _.get(schema, 'x-model');
	let entityId;
	if (_.isObject(entityOrId)) {
		entityId = entityOrId[idPropertyName];
	} else {
		entityId = entityOrId;
	}
	const entity = _.get(entityDictionary, [modelName, entityId]);

	return {
		entity,
		id: entityId,
	};
}

function visitObject(obj, schema, entityDictionary, bag, maxLevel, currentLevel) {
	let denormalized = obj;
	_.each(_.get(schema, 'properties'), (propertySchema, key) => {
		// console.log('FOR KEY:', key, 'FOUND SCHEMA:', findSchemaForProperty(schema, key));
		if (propertySchema && obj[key]) {
			denormalized = setIn(
				denormalized,
				[key],
				visit(obj[key], propertySchema, entityDictionary, bag, maxLevel, currentLevel + 1) // eslint-disable-line
			);
		}
	});
	return denormalized;
}
function visitEntity(obj, schema, entityDictionary, bag, maxLevel, currentLevel) {
	const modelName = _.get(schema, 'x-model');
	const { entity, id } = resolveEntityOrId(obj, schema, entityDictionary);

	if (!bag.hasOwnProperty(modelName)) {
		bag[modelName] = {};
	}

	if (!bag[modelName].hasOwnProperty(id)) {
		// Ensure we don't mutate it non-immutable objects
		const newObj = merge({}, entity);

		// Need to set this first so that if it is referenced within the call to
		// visitObject, it will already exist.
		bag[modelName][id] = newObj;
		bag[modelName][id] = visitObject(newObj, schema, entityDictionary, bag, maxLevel, currentLevel);

		const allOf = _.get(schema, 'allOf');
		if (allOf) {
			_.each(allOf, (subModelSchema) => {
				const subModelSchemaModelName = _.get(subModelSchema, 'x-model');
				if (subModelSchemaModelName) {
					bag[modelName][id] = {
						...bag[modelName][id],
						...visitEntity(
							_.get(entityDictionary, [subModelSchema['x-model'], id], {}),
							subModelSchema,
							entityDictionary,
							bag,
							maxLevel,
							currentLevel
						),
					};
				} else {
					bag[modelName][id] = {
						...bag[modelName][id],
						...visitObject(
							bag[modelName][id],
							subModelSchema,
							entityDictionary,
							bag,
							maxLevel,
							currentLevel
						),
					};
				}
			});
		}
	}

	return bag[modelName][id];
}
function visitArray(arr, schema, entityDictionary, bag, maxLevel, currentLevel) {
	return arr.map(
		(item) => visit(
			item,
			schema.items,
			entityDictionary,
			bag,
			maxLevel,
			currentLevel
		)
	);
}

function visit(obj, schema, entityDictionary, bag, maxLevel, currentLevel = 0) {
	if (!(maxLevel >= currentLevel)) {
		return obj;
	}

	const type = _.get(schema, 'type', 'object');
	if (obj === null || typeof obj === 'undefined' || !_.isObject(schema)) {
		return obj;
	}

	const modelName = _.get(schema, 'x-model');
	if (modelName && type === 'object') {
		return visitEntity(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
	} else if (type === 'array') {
		return visitArray(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
	}
	// return obj;
	return visitObject(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
}

/**
 * Construct nested value by schema from entities dictionary
 *
 * @param {EntityId | Array<EntityId> | Entity | Array<Entity>} ids - entities spec
 * @param {JsonSchema} schema to denormalize by
 * @param {NormalizedEntityDictionary} entityDictionary
 * @param {?number} maxLevel - max level of nesting when denormalizing
 */
export default function denormalize(obj,
									schema:JsonSchema,
									entityDictionary:NormalizedEntityDictionary,
									maxLevel:number = 1):Entity|Array<Entity> {
	return visit(obj, schema, entityDictionary, {}, maxLevel);
}
