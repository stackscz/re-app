import { formatPattern } from 'react-router/lib/PatternUtils';

function normalize(origStr) {
	let str = origStr;
	// make sure protocol is followed by two slashes
	str = str.replace(/:\//g, '://');
	// remove consecutive slashes
	str = str.replace(/([^:\s])\/+/g, '$1/');
	// remove trailing slash before parameters or hash
	str = str.replace(/\/(\?|#)/g, '$1');
	return str;
}

function urlJoin(...params) {
	const joined = [].slice.call(params, 0).join('/');
	return normalize(joined);
}

/**
 * @author Adapted from https://github.com/maslianok.
 */
export default function reverse(routes, name, params, parentPath = '') {
	if (!routes) {
		console.error('Routes were not provided for reverse().');
	}

	for (let i = 0; i < routes.length; i++) {
		const route = routes[i];
		let currentPath;
		if (route.path && route.path[0] === '/') {
			// Absolute path.
			currentPath = route.path;
		} else {
			// Relative path.
			currentPath = route.path ? urlJoin(parentPath, route.path) : parentPath;
		}

		if (route.name && name === route.name) {
			return formatPattern(currentPath, params);
		}

		if (route.indexRoute) {
			const url = reverse([route.indexRoute], name, params, currentPath);
			if (url) {
				return url;
			}
		}
		if (route.childRoutes) {
			const url = reverse(route.childRoutes, name, params, currentPath);
			if (url) {
				return url;
			}
		}
	}

	if (!parentPath) {
		console.error(`No reverse match for name '${name}'`);
	}

	return undefined;
}
