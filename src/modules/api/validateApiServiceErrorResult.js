import validateApiServiceResult from './validateApiServiceResult';

export default function validateApiServiceErrorResult(functionName, result, propType) {
	if (_.isError(result)) {
		throw result;
	}
	validateApiServiceResult(functionName, result, propType);
}
