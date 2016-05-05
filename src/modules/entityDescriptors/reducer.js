import _ from 'lodash';
import { createCheckedReducer } from 're-app/utils';
import { t } from 'redux-tcomb';
import {
	SchemasDictionary,
FieldsetsDictionary
} from './types';
import {
	RECEIVE_ENTITY_DESCRIPTORS,
	GENERATE_MAPPINGS
} from './actions';
import { Schema, arrayOf } from 'normalizr';
import update from 'immutability-helper';

export default createCheckedReducer(
	t.struct({
		schemas: SchemasDictionary,
		fieldsets: FieldsetsDictionary
	}),
	{
		schemas: {},
		fieldsets: {},
		mappings: {}
	},
	{
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
		[RECEIVE_ENTITY_DESCRIPTORS]: (state, action) => {
			const {schemas, fieldsets} = action.payload;
			return update(state, {
				schemas: {'$merge': schemas},
				fieldsets: {'$merge': fieldsets}
			});
		}
	}
);
