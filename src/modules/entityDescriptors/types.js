import _ from 'lodash';
import t from 'tcomb';

export const EntityValueFieldSchema = t.struct({
	name: t.String,
	type: t.String,
});

export const EntityAssociationFieldSchema = t.struct({
	name: t.String,
	type: t.refinement(t.String, (x) => x === 'association', 'Association type value'),
	isMultiple: t.Boolean,
	collectionName: t.String,
});

export const EntityFieldSchema = t.union([EntityValueFieldSchema, EntityAssociationFieldSchema]);
EntityFieldSchema.dispatch = (x) => {
	if (x.type === 'association') {
		return EntityAssociationFieldSchema;
	}
	return EntityValueFieldSchema;
};

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
		(dictionary) => _.every(dictionary, (item, key) => item.name === key),
		'Schema fields dictionary'
	),
});

export const SchemasDictionary = t.refinement(
	t.dict(
		t.String,
		EntitySchema
	),
	(dictionary) => _.every(dictionary, (item, key) => item.name === key),
	'Schemas dictionary'
);

export const FieldsetsDictionary = t.dict(t.String, t.dict(t.String, t.list(t.String)));
