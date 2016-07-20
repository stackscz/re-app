export default {
	person: {
		first_name: {
			required: 'First name is required',
			minLength: 'First name must have at least 2 characters.',
		},
		last_name: {
			required: 'Last name is required',
			minLength: 'Last name must have at least 2 characters.',
		},
		address: {
			street: {
				required: 'Street is required',
			},
			street_number: {
				required: 'Street number is required',
				pattern: 'This field must be a number.',
			},
			city: {
				required: 'City is required',
			},
			country: {
				required: 'Country is required',
			},
		},
	},
	orientation: {
		enum: 'Orientation of the paper must be vetical.',
	},
	password: {
		required: 'Password is required',
		minLength: 'Password must have at least 5 characters.',
	},
};
