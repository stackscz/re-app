import validateObject from 're-app/utils/validateObject';

export default function validateApiServiceResult(functionName, result, propType) {
	const error = validateObject(result, propType);
	if (error) {
		console.warn('ApiService result validation failed for function "' + functionName + '"', error.message);
	}
}
