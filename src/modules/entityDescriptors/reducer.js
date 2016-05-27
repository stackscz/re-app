import _ from 'lodash';
import createReducer from 'utils/createReducer';
import t from 'tcomb';
import { validate } from 'tcomb-validation';
import {
	SchemasDictionary,
	FieldsetsDictionary,
	EntityAssociationFieldSchema
} from './types';
import {
	INITIALIZE,
	RECEIVE_ENTITY_DESCRIPTORS,
	GENERATE_MAPPINGS
} from './actions';
import update from 'immutability-helper';

export default createReducer(
	t.struct({
		schemas: SchemasDictionary,
		fieldsets: FieldsetsDictionary,
		initialized: t.Boolean
	}),
	{
		schemas: {},
		fieldsets: {},
		initialized: false
	},
	{
		[INITIALIZE]: [
			t.Nil,
			(state) => {
				return state;
			}
		],
		[RECEIVE_ENTITY_DESCRIPTORS]: [
			t.struct({
				schemas: t.Object,
				fieldsets: t.Object
			}),
			(state, action) => {
				const {schemas, fieldsets} = action.payload;
				return state.merge({schemas, fieldsets, initialized: true}, {deep: true});
			}
		]
	}
);
