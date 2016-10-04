/* eslint-disable */
import { useRouterHistory, browserHistory } from 'react-router';
import createHistoryLib from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';
import withScroll from 'scroll-behavior';
import qs from 'qs';
import { assign } from 'lodash';

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var history = undefined;
export default function createHistory(config = {}) {
	if (!history && canUseDOM) {
		history = withScroll(
			useRouterHistory(createHistoryLib)(
				assign(
					{
						parseQueryString: function (queryString) {
							const parsedQueryObject = qs.parse(queryString);
							return parseValues(parsedQueryObject);
						},
						stringifyQuery: function (query) {
							return qs.stringify(query, { encode: false });
						}
					},
					config
				)
			)
		);
	}
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
