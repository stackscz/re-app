export default {
	posts: {
		name: 'posts',
		idFieldName: 'id',
		displayFieldName: 'title',
		isFilterable: true,
		fields: {
			id: {
				name: 'id',
				type: 'integer',
			},
			title: {
				name: 'title',
				type: 'string',
			},
			author: {
				name: 'author',
				type: 'association',
				modelName: 'users',
				isMultiple: false,
			},
			tags: {
				name: 'tags',
				type: 'association',
				modelName: 'tags',
				isMultiple: true,
			},
		},
	},
	tags: {
		name: 'tags',
		idFieldName: 'name',
		displayFieldName: 'name',
		isFilterable: true,
		fields: {
			name: {
				name: 'name',
				type: 'integer',
			},
			posts: {
				name: 'posts',
				type: 'association',
				modelName: 'posts',
				isMultiple: true,
			},
		},
	},
	users: {
		name: 'users',
		idFieldName: 'id',
		displayFieldName: 'email',
		isFilterable: true,
		fields: {
			id: {
				name: 'id',
				type: 'integer',
			},
			email: {
				name: 'email',
				type: 'string',
			},
			articles: {
				name: 'articles',
				type: 'association',
				modelName: 'posts',
				isMultiple: true,
			},
		},
	},
};
