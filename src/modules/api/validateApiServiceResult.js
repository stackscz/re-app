import validateObject from 're-app/utils/validateObject';
import invariant from 'invariant';

export default function validateApiServiceResult(functionName, result, propType) {
	const error = validateObject(result, propType);
	invariant(!error,'ApiService result validation failed for function "%s": %s', functionName, error && error.message);
}
