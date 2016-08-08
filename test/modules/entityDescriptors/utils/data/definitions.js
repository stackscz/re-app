export default {
	Post: {
		'x-idPropertyName': 'id',
		'x-displayPropertyName': 'title',
		properties: {
			id: {
				type: 'integer',
			},
			title: {
				type: 'string',
			},
			author: {
				$ref: '#/definitions/User',
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
				type: 'integer',
			},
			posts: {
				type: 'array',
				items: {
					$ref: '#/definitions/Post',
				},
			},
		},
	},
	User: {
		'x-idPropertyName': 'id',
		'x-displayPropertyName': 'email',
		properties: {
			id: {
				type: 'integer',
			},
			email: {
				type: 'string',
			},
			articles: {
				type: 'array',
				items: {
					$ref: '#/definitions/Post',
				},
			},
		},
	},
};
