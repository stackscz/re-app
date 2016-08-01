import createReducer from 'utils/createReducer';
import t from 'tcomb';
import Immutable from 'seamless-immutable';
import type { ResourcesDictionary } from 'types/ResourcesDictionary';
import type { SchemasDictionary } from 'types/SchemasDictionary';
import type { FieldsetsDictionary } from 'types/FieldsetsDictionary';
import {
	RECEIVE_ENTITY_DESCRIPTORS,
} from './actions';

export default createReducer(
	t.struct({
		resources: ResourcesDictionary,
		schemas: SchemasDictionary,
		fieldsets: FieldsetsDictionary,
		initialized: t.Boolean,
	}),
	Immutable.from({
		resources: {},
		schemas: {},
		fieldsets: {},
		initialized: false,
	}),
	{
		[RECEIVE_ENTITY_DESCRIPTORS]: [
			t.struct({
				resources: t.Object,
				schemas: t.Object,
				fieldsets: t.Object,
			}),
			(state, action) => {
				const { schemas, fieldsets, resources } = action.payload;
				return state.merge({ schemas, fieldsets, resources, initialized: true }, { deep: true });
			},
		],
	}
);
