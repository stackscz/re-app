import _ from 'lodash';

export default function createConstants(constants, prefix) {
	return constants.reduce((accumulatedConstants, constantName) => {
		return _.assign(accumulatedConstants, {
			[constantName]: prefix + constantName
		});
	}, {});
}
