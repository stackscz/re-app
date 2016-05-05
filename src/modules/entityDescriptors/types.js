import { t } from 'redux-tcomb';

const SchemasDictionary = t.refinement(
	t.dict(
		t.String,
		t.struct({
			name: t.String,
			idFieldName: t.String,
			displayFieldName: t.String,
			isFilterable: t.Boolean,
			fields: t.refinement(
				t.dict(
					t.String,
					t.struct({
						name: t.String,
						type: t.String
					})
				),
				(dictionary)=> {
					return _.every(dictionary, (item, key) => item.name === key);
				},
				'Schema fields dictionary'
			)
		})
	),
	(dictionary)=> {
		return _.every(dictionary, (item, key) => item.name === key);
	},
	'Schemas dictionary'
);

const FieldsetsDictionary = t.dict(t.String, t.dict(t.String, t.list(t.String)));

export {
	SchemasDictionary,
	FieldsetsDictionary
}
