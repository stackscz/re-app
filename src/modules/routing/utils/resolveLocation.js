import _ from 'lodash';
import reverse from './reverse';

export default function resolveLocation(location, routes) {
	if (_.isObject(location) && location.name) {
		const params = location.params;
		const name = location.name;
		return { ...location, pathname: reverse(routes, name, params) };
	}
	return location;
}
