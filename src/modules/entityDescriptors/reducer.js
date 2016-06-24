import createReducer from 'utils/createReducer';
import t from 'tcomb';
import {
	SchemasDictionary,
	FieldsetsDictionary,
} from './types';
import {
	INITIALIZE,
	RECEIVE_ENTITY_DESCRIPTORS,
} from './actions';

export default createReducer(
	t.struct({
		schemas: SchemasDictionary,
		fieldsets: FieldsetsDictionary,
		initialized: t.Boolean,
	}),
	{
		schemas: {},
		fieldsets: {},
		initialized: false,
	},
	{
		[INITIALIZE]: [
			t.Nil,
			(state) => state,
		],
		[RECEIVE_ENTITY_DESCRIPTORS]: [
			t.struct({
				schemas: t.Object,
				fieldsets: t.Object,
			}),
			(state, action) => {
				const { schemas, fieldsets } = action.payload;
				return state.merge({ schemas, fieldsets, initialized: true }, { deep: true });
			},
		],
	}
);
