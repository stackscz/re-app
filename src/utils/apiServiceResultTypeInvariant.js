import _ from 'lodash';
import typeInvariant from './typeInvariant';

export default function apiServiceResultTypeInvariant(result, type) {
	if (_.isError(result)) {
		throw result;
	}
	typeInvariant(result, type, 'ApiService result validation failed.');
}
