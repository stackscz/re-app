import invariant from 'invariant';
import { validate } from 'tcomb-validation';

export default function typeInvariant(value, type, message = "") {
	const validationResult = validate(value, type);
	const firstError = validationResult.firstError();
	const tcombMessage = firstError && firstError.message;
	invariant(
		validationResult.isValid(),
		'Type validation failed:\n\n%s\n\n%s',
		tcombMessage,
		message
	)
}
