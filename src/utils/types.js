import t from 'tcomb';

export const FormField = t.union([
	t.String,
	t.struct({
		name: t.String,
		validations: t.maybe(t.Any)
	})
]);
FormField.dispatch = function (x) {
	for (var type in this.meta.types) {
		try {
			this.meta.types[type](x);
			return this.meta.types[type];
		} catch (e) {
			// incompatible constructor, continue
		}
	}
};

export const ApiErrorResult = t.struct({
	message: t.String,
	originalResponse: t.maybe(t.Object)
});

export const ApiValidationErrorResult = ApiErrorResult.extend({
	validationErrors: t.Object
});
