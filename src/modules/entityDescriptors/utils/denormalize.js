import _ from 'lodash';
import typeInvariant from 'utils/typeInvariant';
import { denormalize as denormalizrDenormalize } from 'denormalizr';
import createNormalizrSchema from './createNormalizrSchema';
import trimSchema from './trimSchema';
import t from 'tcomb';

const EntitiesSpec = t.union([
	t.String,
	t.list(t.String),
	t.list(t.object()),
]);

/**
 * Construct nested object or array of nested objects from entities dictionary
 *
 * @param {string|array} ids - single id or array of ids to denormalize
 * @param {string} collectionName
 * @param {EntityDictionary} entityDictionary
 * @param {SchemasDictionary} schemas
 * @param {?number} maxLevel - max level of nesting when denormalizing
 */
export default function denormalize(ids, collectionName, entityDictionary, schemas, maxLevel = 1) {
	typeInvariant(
		ids,
		EntitiesSpec,
		'Invalid entity specification for denormalize, should be %s',
		EntitiesSpec.toString()
	);

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
