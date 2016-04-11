import _ from 'lodash';

_.mixin({
	revealNumber: (val) => {
		const numVal = parseFloat(val);
		return isNaN(numVal) ? val : numVal;
	}
});

export default _;
