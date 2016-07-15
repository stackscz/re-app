export default {
	schemas: {
		posts: {
			name: 'posts',
			displayFieldName: 'title',
			idFieldName: 'id',
			isFilterable: false,
			fields: {
				id: {
					name: 'id',
					type: 'Integer',
				},
				title: {
					name: 'title',
					type: 'String',
				},
				tags: {
					name: 'tags',
					type: 'association',
					isMultiple: true,
					collectionName: 'tags',
				},
			},
		},
		tags: {
			name: 'tags',
			idFieldName: 'name',
			displayFieldName: 'name',
			isFilterable: false,
			fields: {
				name: {
					name: 'name',
					type: 'String',
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
