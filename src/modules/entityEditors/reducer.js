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
import update from 'react-addons-update';
import hash from 'object-hash';

export default createReducer({
	editors: {}
}, {
	[LOAD_ENTITY]: (state, action) => {
		const { collectionName, entityId } = action.payload;
		const editorHash = hash({collectionName, entityId});
		return update(state, {
			editors: {
				[editorHash]: {
					'$set': {
						ready: false
					}
				}
			}
		});
	},
	[LOAD_ENTITY_SUCCESS]: (state, action) => {
		const { collectionName, entityId, entity } = action.payload;
		const editorHash = hash({collectionName, entityId});
		return update(state, {
			editors: {
				[editorHash]: {
					'$set': {
						entity,
						ready: true
					}
				}
			}
		});
	}
});
