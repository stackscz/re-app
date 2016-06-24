import ArraySchema from 'normalizr/lib/IterableSchema';
import { arrayOf } from 'normalizr';

function defineAssocs(targetSchema, sourceSchema, maxDepth, currentDepth) {
	if (currentDepth > maxDepth) {
		return;
	}
	Object.keys(sourceSchema)
		.filter(attribute => attribute.substring(0, 1) !== '_')
		.forEach(attribute => {
			const assocSchema = sourceSchema[attribute];

			let assocSchemaResult = null;
			let isArraySchema = false;
			if (assocSchema instanceof ArraySchema) {
				assocSchemaResult = new (assocSchema.getItemSchema().constructor)(
					assocSchema.getItemSchema().getKey(),
					{ idAttribute: assocSchema.getItemSchema().getIdAttribute() }
				);
				isArraySchema = true;
			} else {
				assocSchemaResult = new (assocSchema.constructor)(
					assocSchema.getKey(),
					{ idAttribute: assocSchema.getIdAttribute() }
				);
			}

			defineAssocs(assocSchemaResult, sourceSchema[attribute], maxDepth, currentDepth + 1);
			targetSchema.define({
				[attribute]: isArraySchema ? arrayOf(assocSchemaResult) : assocSchemaResult,
			});
		});
}

export default function trimSchema(sourceSchema, maxDepth) {
	const resultSchema = new sourceSchema.constructor(
		sourceSchema.getKey(),
		{ idAttribute: sourceSchema.getIdAttribute() }
	);
	defineAssocs(resultSchema, sourceSchema, maxDepth, 1);
	return resultSchema;
}
