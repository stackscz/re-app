import _ from 'lodash';
import reverse from './reverse';

export default function resolveLocation(location, routes) {
	if (_.isObject(location) && location.name) {
		var params = location.params;
		var name = location.name;
		return {...location, pathname: reverse(routes, name, params)};
	}
	return location;
}
