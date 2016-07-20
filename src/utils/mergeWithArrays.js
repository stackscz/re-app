import { mergeWith, isArray } from 'lodash';

const mergeWithArrays = (objValue, srcValue) => {
	const merged = isArray(objValue) ? objValue.concat(srcValue) : undefined;
	return merged;
};

export default function (...params) {
	return mergeWith(...params, mergeWithArrays);
}
