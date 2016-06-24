import _ from 'lodash';

export default function rethrowError(e) {
	if (_.isError(e)) {
		throw e;
	}
}
