// @flow
import _ from 'lodash';
import { denormalize as denormalizrDenormalize } from 'denormalizr';
import createNormalizrSchema from './createNormalizrSchema';
import trimSchema from './trimSchema';
import type Entity from 'types/Entity';
import type EntityId from 'types/EntityId';
import type CollectionName from 'types/CollectionName';
import type NormalizedEntityDictionary from 'types/NormalizedEntityDictionary';
import type SchemasDictionary from 'types/SchemasDictionary';

/**
 * Construct nested object or array of nested objects from entities dictionary
 *
 * @param {EntityId | Array<EntityId> | Entity | Array<Entity>} ids - entities spec
 * @param {CollectionName} collectionName
 * @param {NormalizedEntityDictionary} entityDictionary
 * @param {SchemasDictionary} schemas
 * @param {?number} maxLevel - max level of nesting when denormalizing
 */
export default function denormalize(ids:EntityId | Array<EntityId> | Entity | Array<Entity>,
									collectionName:CollectionName,
									entityDictionary:NormalizedEntityDictionary,
									schemas:SchemasDictionary,
									maxLevel:number = 1) {
	// TODO check params
	const normalizrCollectionSchema = createNormalizrSchema(collectionName, schemas);
	const entitySchema = schemas[collectionName];

	let finalNormalizrCollectionSchema = normalizrCollectionSchema;
	if (typeof maxLevel !== 'undefined') {
		finalNormalizrCollectionSchema = trimSchema(normalizrCollectionSchema, maxLevel);
	}

	let result;
	if (_.isArray(ids)) {
		result = _.map(ids, id => {
			const entityId = _.isObject(id) ? id[entitySchema.idFieldName] : id;
			return denormalizrDenormalize(
				entityDictionary[collectionName][entityId],
				entityDictionary,
				finalNormalizrCollectionSchema
			);
		});
	} else {
		const entityId = _.isObject(ids) ? ids[entitySchema.idFieldName] : ids;
		result = denormalizrDenormalize(
			entityDictionary[collectionName][entityId],
			entityDictionary,
			finalNormalizrCollectionSchema
		);
	}

	return result;
}
