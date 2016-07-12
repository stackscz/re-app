import createReducer from 'utils/createReducer';
import t from 'tcomb';
import Immutable from 'seamless-immutable';
import type { SchemasDictionary } from 'types/SchemasDictionary';
import type { FieldsetsDictionary } from 'types/FieldsetsDictionary';
import {
	RECEIVE_ENTITY_DESCRIPTORS,
} from './actions';

export default createReducer(
	t.struct({
		schemas: SchemasDictionary,
		fieldsets: FieldsetsDictionary,
		initialized: t.Boolean,
	}),
	Immutable.from({
		schemas: {},
		fieldsets: {},
		initialized: false,
	}),
	{
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
