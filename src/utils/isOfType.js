import invariant from 'invariant';
import t from 'tcomb';

export default function isOfType(value, type) {
	invariant(t.isType(type), '"type" passed into typeInvariant must be tcomb type');
	try {
		type(value);
		return true;
	} catch (e) {
		return false;
	}
}
