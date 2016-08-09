export default {
	Post: {
		type: 'object',
		'x-model': 'Post',
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
		},
	},
	PostDetail: {
		type: 'object',
		'x-model': 'PostDetail',
		properties: {
			subtitle: {
				type: 'string',
			},
		},
		allOf: [
			{
				$ref: '#/definitions/Post',
			},
			{
				properties: {
					tags: {
						type: 'array',
						items: {
							$ref: '#/definitions/TagDetail',
						},
					},
					authors: {
						'x-mappedBy': 'authoredArticles',
						type: 'array',
						items: {
							$ref: '#/definitions/Author',
						},
					},
				},
			},
		],
	},
	Tag: {
		type: 'object',
		'x-model': 'Tag',
		'x-idPropertyName': 'name',
		'x-displayPropertyName': 'name',
		properties: {
			name: {
				type: 'string',
			},
			data: {
				type: 'object',
			},
		},
	},
	TagDetail: {
		type: 'object',
		'x-model': 'TagDetail',
		allOf: [
			{
				$ref: '#/definitions/Tag',
			},
		],
		properties: {
			author: {
				$ref: '#/definitions/Author',
			},
		},
		'x-relations': {
			author: 'authoredTags',
		},
	},
	User: {
		type: 'object',
		'x-model': 'User',
		'x-idPropertyName': 'username',
		'x-displayPropertyName': 'username',
		properties: {
			username: {
				type: 'string',
			},
		},
	},
	Author: {
		'x-model': 'Author',
		allOf: [
			{
				$ref: '#/definitions/User',
			},
			{
				type: 'object',
				properties: {
					authoredPosts: {
						'x-mappedBy': 'authors',
						type: 'array',
						items: {
							$ref: '#/definitions/Post',
						},
					},
					authoredTags: {
						'x-mappedBy': 'tags',
						type: 'array',
						items: {
							$ref: '#/definitions/Tag',
						},
					},
				},
			},
		],
	},
};
