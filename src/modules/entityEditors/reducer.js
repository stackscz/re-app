import _ from 'lodash';
import { createReducer } from 're-app/utils';
import {
	LOAD_EDITOR,
	LOAD_EDITOR_SUCCESS,
	LOAD_EDITOR_FAILURE,
	DESTROY_EDITOR,
	SAVE
} from './actions';
import {
	RECEIVE_PERSIST_ENTITY_SUCCESS
} from '../entityStorage/actions';
import hash from 'object-hash';
import update from 'immutability-helper';
import invariant from 'invariant';

export default createReducer({
	editors: {}
}, {
	[LOAD_EDITOR]: (state, action) => {
		const { editorHash, collectionName, entityId } = action.payload;
		return update(state, {
			editors: {
				[editorHash]: {
					$set: {
						id: editorHash,
						ready: false,
						collectionName,
						entityId
					}
				}
			}
		});
	},
	[LOAD_EDITOR_SUCCESS]: (state, action) => {
		const { editorHash } = action.payload;
		return update(state, {
			editors: {
				[editorHash]: {
					ready: {$set: true}
				}
			}
		});
	},
	[LOAD_EDITOR_FAILURE]: (state, action) => {
		const { editorHash, errors } = action.payload;
		return update(state, {
			editors: {
				[editorHash]: {
					ready: {$set: false},
					errors: {$set: errors}
				}
			}
		});
	},
	[SAVE]: (state, action) => {
		const { editorHash, data } = action.payload;
		const editor = state.editors[editorHash];
		invariant(editor, 'Editor "%s" not found!', editorHash);
		if (!editor.entityId) {
			const entityId = hash(data);
			return update(state, {
				editors: {
					[editorHash]: {
						entityId: {$set: entityId}
					}
				}
			});
		} else {
			return state;
		}
	},
	[RECEIVE_PERSIST_ENTITY_SUCCESS]: (state, action) => {
		const { entityId, transientEntityId } = action.payload;

		let newState = state;
		_.each(state.editors, (editor, editorId) => {
			if (editor.entityId === transientEntityId) {
				newState = update(newState, {
					editors: {
						[editorId]: {
							entityId: {$set: entityId}
						}
					}
				});
			}
		});
		return newState;
	},
	[DESTROY_EDITOR]: (state, action) => {
		const { editorHash } = action.payload;
		return update(state, {
			editors: {
				$delete: editorHash
			}
		});
	}
});
