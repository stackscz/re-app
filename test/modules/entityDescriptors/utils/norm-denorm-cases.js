import dereferenceSchema from 'modules/entityDescriptors/utils/dereferenceSchema';
import definitions from './data/definitions';

export default [
	[
		dereferenceSchema({
			$ref: '#/definitions/PostDetail',
			definitions,
		}),
		{
			id: 1,
			title: 'Some post',
			subtitle: 'Some post subtitle',
			tags: [
				{
					name: 'tag-1',
				},
				{
					name: 'tag-2',
				},
			],
		},
		{
			result: 1,
			entities: {
				Post: {
					1: {
						id: 1,
						title: 'Some post',
					},
				},
				PostDetail: {
					1: {
						subtitle: 'Some post subtitle',
						tags: [
							'tag-1',
							'tag-2',
						],
					},
				},
				Tag: {
					'tag-1': {
						name: 'tag-1',
					},
					'tag-2': {
						name: 'tag-2',
					},
				},
				TagDetail: {
					'tag-1': {},
					'tag-2': {},
				},
			},
		},
	],
	[
		dereferenceSchema({
			type: 'array',
			items: {
				$ref: '#/definitions/PostDetail',
			},
			definitions,
		}),
		[
			{
				id: 1,
				title: 'Some post',
				tags: [
					{
						name: 'tag-1',
					},
					{
						name: 'tag-2',
					},
				],
			},
			{
				id: 2,
				title: 'Some post 2',
				tags: [
					{
						name: 'tag-3',
					},
				],
			},
		],
		{
			result: [1, 2],
			entities: {
				Post: {
					1: {
						id: 1,
						title: 'Some post',
					},
					2: {
						id: 2,
						title: 'Some post 2',
					},
				},
				PostDetail: {
					1: {
						tags: [
							'tag-1',
							'tag-2',
						],
					},
					2: {
						tags: [
							'tag-3',
						],
					},
				},
				Tag: {
					'tag-1': {
						name: 'tag-1',
					},
					'tag-2': {
						name: 'tag-2',
					},
					'tag-3': {
						name: 'tag-3',
					},
				},
				TagDetail: {
					'tag-1': {},
					'tag-2': {},
					'tag-3': {},
				},
			},
		},
	],
	[
		dereferenceSchema({
			type: 'array',
			items: {
				$ref: '#/definitions/PostDetail',
			},
			definitions,
		}),
		[
			{
				id: 1,
				title: 'Title 1',
				subtitle: 'Subtitle 1',
				tags: [
					{
						name: 'tag-1',
						author: {
							username: 'author1@example.com',
						},
					},
					{
						name: 'tag-2',
					},
				],
				authors: [
					{
						username: 'author1@example.com',
					},
					{
						username: 'author2@example.com',
					},
				],
			},
			{
				id: 2,
				title: 'Title 2',
				subtitle: 'Subtitle 2',
				tags: [
					{
						name: 'tag-2',
					},
					{
						name: 'tag-3',
					},
				],
				authors: [
					{
						username: 'author2@example.com',
					},
				],
			},
			{
				id: 3,
				title: 'Title 3',
				subtitle: 'Subtitle 3',
				tags: [
					{
						name: 'tag-3',
					},
					{
						name: 'tag-4',
					},
				],
				authors: [
					{
						username: 'author1@example.com',
					},
				],
			},
			{
				id: 4,
				title: 'Title 4',
				subtitle: 'Subtitle 4',
				tags: [
					{
						name: 'tag-4',
					},
				],
			},
		],
		{
			result: [1, 2, 3, 4],
			entities: {
				Post: {
					1: {
						id: 1,
						title: 'Title 1',
					},
					2: {
						id: 2,
						title: 'Title 2',
					},
					3: {
						id: 3,
						title: 'Title 3',
					},
					4: {
						id: 4,
						title: 'Title 4',
					},
				},
				PostDetail: {
					1: {
						subtitle: 'Subtitle 1',
						tags: [
							'tag-1',
							'tag-2',
						],
						authors: [
							'author1@example.com',
							'author2@example.com',
						],
					},
					2: {
						subtitle: 'Subtitle 2',
						tags: [
							'tag-2',
							'tag-3',
						],
						authors: [
							'author2@example.com',
						],
					},
					3: {
						subtitle: 'Subtitle 3',
						tags: [
							'tag-3',
							'tag-4',
						],
						authors: [
							'author1@example.com',
						],
					},
					4: {
						subtitle: 'Subtitle 4',
						tags: [
							'tag-4',
						],
					},
				},
				Tag: {
					'tag-1': {
						name: 'tag-1',
					},
					'tag-2': {
						name: 'tag-2',
					},
					'tag-3': {
						name: 'tag-3',
					},
					'tag-4': {
						name: 'tag-4',
					},
				},
				TagDetail: {
					'tag-1': {
						author: 'author1@example.com',
					},
					'tag-2': {},
					'tag-3': {},
					'tag-4': {},
				},
				User: {
					'author1@example.com': {
						username: 'author1@example.com',
					},
					'author2@example.com': {
						username: 'author2@example.com',
					},
				},
				Author: {
					'author1@example.com': {
						// authoredTags: [
						// 	'tag-1',
						// ],
						// authoredPosts: [],
					},
					'author2@example.com': {
						// authoredTags: [1, 3],
						// authoredPosts: [1, 2],
					},
				},
			},
		},
	],
	[
		dereferenceSchema({
			$ref: '#/definitions/Tag',
			definitions,
		}),
		{
			name: 'tag-foo',
			data: {
				foo: 'bar',
			},
		},
		{
			result: 'tag-foo',
			entities: {
				Tag: {
					'tag-foo': {
						name: 'tag-foo',
						data: {
							foo: 'bar',
						},
					},
				},
			}
		},
	],
];
