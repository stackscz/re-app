export default {
	resources: {
		posts: {
			INDEX: {
				path: '/postsx',
				method: 'get',
			},
		},
	},
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
					modelName: 'tags',
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
		users: {
			name: 'users',
			idFieldName: 'username',
			displayFieldName: 'username',
			isFilterable: false,
			fields: {
				username: {
					name: 'username',
					type: 'String',
				},
			},
		},
		// Post: {
		// 	type: "object",
		// 	required: [
		// 		"id",
		// 	],
		// 	properties: {
		// 		id: {
		// 			type: "integer"
		// 		},
		// 		title: {
		// 			type: "string"
		// 		},
		// 		tags: {
		// 			type: "array",
		// 			items: { $ref: "#/schemas/Tag" },
		// 		},
		// 	},
		// 	'x-displayPropertyName': 'title',
		// 	'x-idPropertyName': 'id',
		// 	'x-isFilterable': false,
		//
		// },
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
