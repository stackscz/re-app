import { each, get as g } from 'lodash';
import walkSchemaProperties from './walkSchemaProperties';

export default function getAssociationsProperties(definitions, modelName) {
	const result = {};
	each(definitions, (definition) => {
		const definitionModelName = g(definition, 'x-model');
		if (definitionModelName) {
			const modelAssociationProperties = [];
			walkSchemaProperties(definition, (propertySchema, propertyName) => {
				const propertySchemaModelName = g(
					propertySchema,
					'x-model',
					g(propertySchema, ['items', 'x-model'])
				);
				if (propertySchemaModelName === modelName) {
					modelAssociationProperties.push(propertyName);
				}
			});

			if (modelAssociationProperties.length) {
				result[definitionModelName] = modelAssociationProperties;
			}
		}
	});
	return result;
}
