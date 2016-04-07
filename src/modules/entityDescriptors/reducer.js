/* eslint-disable */
import _ from 'lodash';
import { PropTypes } from 'react';
import { createReducer } from 're-app/utils';
import { INITIALIZE, LOAD_ENTITY_DESCRIPTORS_SUCCESS, GENERATE_MAPPINGS } from './actions';
import { Schema, arrayOf } from 'normalizr';
import { validateObject } from 're-app/utils';
import update from 'react-addons-update';

export default createReducer({
	schemas: {},
	fieldsets: {},
	mappings: {}
}, {
	//[INITIALIZE]: (state) => {
	//	validateObject(1, PropTypes.func);
	//	return state;
	//},
	[GENERATE_MAPPINGS]: (state) => {
		return update(state, {
			mappings: {
				'$apply': () => {
					const mappings = {};
					// create normalizr schemas
					_.each(state.schemas, (schema, collectionName) => {
						mappings[collectionName] = new Schema(collectionName, {idAttribute: schema.idFieldName});
					});

					// define normalizr schemas
					_.each(state.schemas, (schema) => {
						_.each(schema.fields, (field) => {
							if (field.collectionName) {
								const assocMapping = mappings[field.collectionName];
								mappings[schema.name].define({
									[field.name]: field.isMultiple ? arrayOf(assocMapping) : assocMapping
								});
							}
						});
					});

					return mappings;
				}
			}
		});
	},
	[LOAD_ENTITY_DESCRIPTORS_SUCCESS]: (state, action) => {
		const {schemas, fieldsets} = action.payload;
		return update(state, {
			schemas: {'$merge': schemas},
			fieldsets: {'$merge': fieldsets}
		});
	}
});
