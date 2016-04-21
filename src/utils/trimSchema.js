import ArraySchema from 'normalizr/lib/IterableSchema';
import { arrayOf } from 'normalizr';

export default function trimSchema(sourceSchema, maxDepth) {
	const resultSchema = new sourceSchema.constructor(sourceSchema._key, {idAttribute: sourceSchema._idAttribute});
	defineAssocs(resultSchema, sourceSchema, maxDepth, 1);
	return resultSchema;
}

function defineAssocs(targetSchema, sourceSchema, maxDepth, currentDepth) {
	if (currentDepth > maxDepth) {
		return targetSchema;
	}
	Object.keys(sourceSchema)
		.filter(attribute => attribute.substring(0, 1) !== '_')
		.forEach(attribute => {
			const assocSchema = sourceSchema[attribute];

			let assocSchemaResult = null;
			let isArraySchema = false;
			if (assocSchema instanceof ArraySchema) {
				assocSchemaResult = new assocSchema._itemSchema.constructor(assocSchema._itemSchema._key, {idAttribute: assocSchema._itemSchema._idAttribute});
				isArraySchema = true;
			} else {
				assocSchemaResult = new assocSchema.constructor(assocSchema._key, {idAttribute: assocSchema._idAttribute});
			}

			defineAssocs(assocSchemaResult, sourceSchema[attribute], maxDepth, currentDepth + 1);
			targetSchema.define({
				[attribute]: isArraySchema ? arrayOf(assocSchemaResult) : assocSchemaResult
			});
		});
}
