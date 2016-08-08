// @flow
import _ from 'utils/lodash';
import invariant from 'invariant';
import type { DefinitionsDictionary } from 'types/DefinitionsDictionary';
import { Schema, arrayOf } from 'normalizr';

let cachedDefinitions;
let mappings = {};

/**
 * Generates `normalizr` definitions from internal definitions
 *
 * @param {string} modelName
 * @param {DefinitionsDictionary} definitions
 * @returns {Schema} normalizr definition for collection
 */
export default function createNormalizrSchema(modelName:string, definitions:DefinitionsDictionary) {
	invariant(definitions[modelName], 'Unknown collection %s', JSON.stringify(modelName));
	if (!_.get(definitions, modelName)) {
		return undefined;
	}

	if (cachedDefinitions !== definitions) {
		cachedDefinitions = definitions;
		mappings = {};


		// create normalizr definitions
		_.each(cachedDefinitions, (definition, cachedCollectionName) => {
			mappings[cachedCollectionName] = new Schema(
				cachedCollectionName,
				{ idAttribute: definition['x-idPropertyName'] }
			);
		});

		// define normalizr definitions
		_.each(cachedDefinitions, (definition, modelNameToDefine) => {
			_.each(definition.properties, (prop, propName) => {
				const assocModelPointer = _.get(prop, '$ref') || _.get(prop, ['items', '$ref']);
				if (assocModelPointer) {
					const assocModelName = _(assocModelPointer).split('/').pop();
					// console.log(modelNameToDefine);
					// console.log(assocModelName);
					// console.log(prop);
					const isMany = _.get(prop, 'type') === 'array';
					// console.log(isMany);
					const assocMapping = mappings[assocModelName];
					mappings[modelNameToDefine].define({
						[propName]: isMany ? arrayOf(assocMapping) : assocMapping,
					});
				}
			});
		});
	}


	return mappings[modelName];
}
