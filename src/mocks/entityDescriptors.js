export default {
	definitions: {
		Post: {
			'x-idPropertyName': 'id',
			'x-displayPropertyName': 'title',
			properties: {
				id: {
					type: 'integer',
					readOnly: true,
				},
				title: {
					type: 'string',
				},
				tags: {
					type: 'array',
					items: {
						$ref: '#/definitions/Tag',
					},
				},
			},
		},
		Tag: {
			'x-idPropertyName': 'name',
			'x-displayPropertyName': 'name',
			properties: {
				name: {
					type: 'string',
				},
			},
		},
		User: {
			'x-idPropertyName': 'username',
			'x-displayPropertyName': 'username',
			properties: {
				username: {
					type: 'string',
				},
			},
		},
	},
	fieldsets: {
		posts: {
			detail: ['title', 'tags'],
			grid: ['title'],
			form: ['title', 'tags'],
		},
		tags: {
			detail: ['name'],
			grid: ['name'],
			form: ['name'],
		},
	},
};
