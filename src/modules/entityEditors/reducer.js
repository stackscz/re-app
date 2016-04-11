/* eslint-disable */
import _ from 'lodash';
import { PropTypes } from 'react';
import { createReducer } from 're-app/utils';
import {
	LOAD_ENTITY,
	LOAD_ENTITY_SUCCESS
} from './actions';
import { Schema, arrayOf } from 'normalizr';
import { validateObject } from 're-app/utils';
import update from 'immutability-helper';

export default createReducer({
	editors: {}
}, {
	[LOAD_ENTITY]: (state, action) => {
		const { collectionName, entityId } = action.payload;
		return update(state, {
			editors: {
				$merge: {
					[collectionName]: {
						[entityId]: {
							ready: false,
							collectionName,
							entityId
						}
					}
				}
			}
		});
	},
	[LOAD_ENTITY_SUCCESS]: (state, action) => {
		const { collectionName, entityId, entity } = action.payload;
		return update(state, {
			editors: {
				[collectionName]: {
					[entityId]: {
						data: {$set: entity},
						ready: {$set: true}
					}
				}
			}
		});
	}
});
