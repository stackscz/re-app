import _ from 'lodash';
import t from 'tcomb';

export const EntityFieldSchema = t.struct({
	name: t.String,
	type: t.String
});

export const EntitySchema = t.struct({
	name: t.String,
	idFieldName: t.String,
	displayFieldName: t.String,
	isFilterable: t.Boolean,
	fields: t.refinement(
		t.dict(
			t.String,
			EntityFieldSchema
		),
		(dictionary) => {
			return _.every(dictionary, (item, key) => item.name === key);
		},
		'Schema fields dictionary'
	)
});

export const SchemasDictionary = t.refinement(
	t.dict(
		t.String,
		EntitySchema
	),
	(dictionary) => {
		return _.every(dictionary, (item, key) => item.name === key);
	},
	'Schemas dictionary'
);

export const FieldsetsDictionary = t.dict(t.String, t.dict(t.String, t.list(t.String)));