import assign from 'object-assign';

export default function createConstants(constants, prefix) {
	return constants.reduce((accumulatedConstants, constantName) => {
		return assign(accumulatedConstants, {
			[constantName]: prefix + constantName
		});
	}, {});
}

