import deref from 'json-schema-deref-local';

export default function dereferenceSchema(schema) {
	return deref(schema);
}
