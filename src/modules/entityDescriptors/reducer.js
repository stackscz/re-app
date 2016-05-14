import _ from 'lodash';
import { createReducer } from 're-app/utils';
import t from 'tcomb';
import { validate } from 'tcomb-validation';
import {
	SchemasDictionary,
	FieldsetsDictionary,
	EntityAssociationFieldSchema
} from './types';
import {
	RECEIVE_ENTITY_DESCRIPTORS,
	GENERATE_MAPPINGS
} from './actions';
import update from 'immutability-helper';

const ENABLE_SEAMLESS_IMMUTABLE = true;

export default createReducer(
	t.struct({
		schemas: SchemasDictionary,
		fieldsets: FieldsetsDictionary
	}),
	{
		schemas: {},
		fieldsets: {}
	},
	{
		//[GENERATE_MAPPINGS]: (state) => { // this is computed on the fly and memoized in selector
		//
		//	const mappings = {};
		//	// create normalizr schemas
		//	_.each(state.schemas, (schema, collectionName) => {
		//		mappings[collectionName] = new Schema(collectionName, {idAttribute: schema.idFieldName});
		//	});
		//
		//	// define normalizr schemas
		//	_.each(state.schemas, (schema) => {
		//		_.each(schema.fields, (field) => {
		//			if (validate(field, EntityAssociationFieldSchema).isValid()) {
		//				const assocMapping = mappings[field.collectionName];
		//				mappings[schema.name].define({
		//					[field.name]: field.isMultiple ? arrayOf(assocMapping) : assocMapping
		//				});
		//			}
		//		});
		//	});
		//
		//	if (ENABLE_SEAMLESS_IMMUTABLE) {
		//		return state.merge({mappings});
		//	} else {
		//		return update(state, {
		//			mappings: {'$set': mappings}
		//		});
		//	}
		//},
		[RECEIVE_ENTITY_DESCRIPTORS]: (state, action) => {
			const {schemas, fieldsets} = action.payload;
			if (ENABLE_SEAMLESS_IMMUTABLE) {
				return state.merge({schemas, fieldsets});
			} else {
				return update(state, {
					schemas: {'$merge': schemas},
					fieldsets: {'$merge': fieldsets}
				});
			}
		}
	}
);
