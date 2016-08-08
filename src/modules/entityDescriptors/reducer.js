import createReducer from 'utils/createReducer';
import t from 'tcomb';
import Immutable from 'seamless-immutable';
import type { DefinitionsDictionary } from 'types/DefinitionsDictionary';
import type { FieldsetsDictionary } from 'types/FieldsetsDictionary';
import {
	RECEIVE_ENTITY_DESCRIPTORS,
} from './actions';

export default createReducer(
	t.struct({
		definitions: DefinitionsDictionary,
		fieldsets: FieldsetsDictionary,
		initialized: t.Boolean,
	}),
	Immutable.from({
		definitions: {},
		fieldsets: {},
		initialized: false,
	}),
	{
		[RECEIVE_ENTITY_DESCRIPTORS]: [
			t.struct({
				definitions: t.Object,
				fieldsets: t.Object,
			}),
			(state, action) => {
				const { definitions, fieldsets, resources } = action.payload;
				return state.merge({
					definitions,
					fieldsets,
					resources,
					initialized: true,
				}, { deep: true });
			},
		],
	}
);
