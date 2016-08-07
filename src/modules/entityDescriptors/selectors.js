import _ from 'lodash';
import invariant from 'invariant';

export const isInitialized = (state) => state.entityDescriptors.initialized;
export const getEntitySchemas = (state) =>
	(state.entityDescriptors ? state.entityDescriptors.schemas : undefined);
export const getEntityFieldsets = (state) =>
	(state.entityDescriptors ? state.entityDescriptors.fieldsets : undefined);
export const getEntitySchemaGetter = (modelName) =>
	(state) =>
		_.get(state, ['entityDescriptors', 'schemas', modelName]);

import { validate } from 'tcomb-validation';
import { Schema, arrayOf } from 'normalizr';
import type { EntityAssociationFieldSchema } from 'types/EntityAssociationFieldSchema';

export const getEntityMappingGetter = (modelName) => (state) => {
	const schemas = _.get(state, ['entityDescriptors', 'schemas']);
	const schema = _.get(schemas, modelName);
	if (!schema) {
		return undefined;
	}

	const mapping = new Schema(modelName, { idAttribute: schema.idFieldName });
	try {
		_.each(schema.fields, (field) => {
			if (validate(field, EntityAssociationFieldSchema).isValid()) {
				// const assocMapping = mappings[field.modelName];
				const fieldSchema = schemas[field.modelName];
				invariant(fieldSchema, 'Unknown schema');
				const assocMapping = new Schema(
					field.modelName,
					{ idAttribute: fieldSchema.idFieldName }
				);
				mapping.define({
					[field.name]: field.isMultiple ? arrayOf(assocMapping) : assocMapping,
				});
			}
		});
	} catch (e) {
		if (e === 'unknownSchema') {
			return undefined;
		}
		throw e;
	}
	return mapping;
};
