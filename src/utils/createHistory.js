/* eslint-disable */
import { useRouterHistory, browserHistory } from 'react-router';
import createHistoryLib from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';
import qs from 'qs';

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var history = undefined;
if (canUseDOM) {
	history = useRouterHistory(createHistoryLib)({
		parseQueryString: function (queryString) {
			const parsedQueryObject = qs.parse(queryString);
			return parseValues(parsedQueryObject);
		},
		stringifyQuery: function (query) {
			return qs.stringify(query, {encode: false});
		}
	});
}

export default function createHistory() {
	return history;
}

function isNumber(val) {
	return !isNaN(parseFloat(val)) && isFinite(val);
}
function isObject(val) {
	return val.constructor === Object;
}
function isArray(val) {
	return Array.isArray(val);
}
function parseValue(val) {
	if (typeof val == 'undefined' || val == '') {
		return null;
	}
	if (isObject(val)) {
		return parseValues(val);
	} else if (isArray(val)) {
		return parseArray(val);
	} else if (isNumber(val)) {
		return parseNumber(val);
	} else {
		return val;
	}
}
function parseValues(obj) {
	var result = {};
	var key, val;
	for (key in obj) {
		val = parseValue(obj[key]);
		if (val !== null) result[key] = val; // ignore null values
	}
	return result;
}

function parseArray(arr) {
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		result[i] = parseValue(arr[i]);
	}
	return result;
}

function parseNumber(val) {
	return Number(val);
}
