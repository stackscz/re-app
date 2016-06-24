import t from 'tcomb';
import _ from 'lodash';

export const FormField = t.union([
	t.String,
	t.struct({
		name: t.String,
		validations: t.maybe(t.Any),
	}),
]);
FormField.dispatch = function dispatch(x) {
	let resultType;
	_.each(this.meta.types, (type) => {
		try {
			type(x);
			resultType = type;
			return false;
		} catch (e) {
			// incompatible constructor, continue
			return true;
		}
	});
	return resultType;
};

export const ApiErrorResult = t.struct({
	code: t.Number,
	message: t.String,
	data: t.maybe(t.Object),
});

export const ApiValidationErrorResult = ApiErrorResult.extend({
	validationErrors: t.Object,
});
