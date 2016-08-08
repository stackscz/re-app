/* eslint-disable */
import expect from 'expect';
import reducer from 'modules/entityDescriptors/reducer';
import {
	INIT
} from 'utils/actions';
import {
	RECEIVE_ENTITY_DESCRIPTORS
} from 'modules/entityDescriptors/actions';

describe('modules/entityDescriptors/reducer', () => {

	it('should return the initial state', () => {
		expect(
			reducer(undefined, {})
		).toEqual(
			{
				definitions: {},
				fieldsets: {},
				initialized: false,
			}
		)
	});

	it('should throw on invalid payload of RECEIVE_ENTITY_DESCRIPTORS', () => {
		expect(() => {
			reducer(undefined, { type: RECEIVE_ENTITY_DESCRIPTORS });
		}).toThrow(/has invalid payload/ig)
	});

	it('should handle RECEIVE_ENTITY_DESCRIPTORS', () => {
		const entityDescriptors = {
			resources: {},
			definitions: {
				Post: {
					'x-idPropertyName': 'id',
					'x-displayPropertyName': 'title',
					properties: {
						id: {
							name: 'id',
							type: 'integer',
						},
						title: {
							name: 'title',
							type: 'string',
						},
					},
				},
			},
			fieldsets: {
				posts: {
					form: ['title'],
				},
			},
		};

		let state = reducer(undefined, {});
		state = reducer(state, {type: INIT});
		state = reducer(
			state,
			{
				type: RECEIVE_ENTITY_DESCRIPTORS,
				payload: entityDescriptors,
			}
		);
		expect(state).toEqual(state, entityDescriptors);
	});
});
