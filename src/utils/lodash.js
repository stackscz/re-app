import _ from 'lodash';

function isNormalInteger(str) {
	return /^\+?(0|[1-9]\d*)$/.test(str);
}

_.mixin({
	revealNumber: (val) => {
		if (isNormalInteger(val)) {
			return parseInt(val, 10);
		}
		return val;
	},
});

export default _;
