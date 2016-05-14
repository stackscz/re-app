import { createReducer } from 're-app/utils';
import _ from 'lodash';
import update from 're-app/utils/immutabilityHelper';

import {
	CREATE_MESSAGE,
	DESTROY_MESSAGE
} from './actions';

export default createReducer(
	{
		defaultTimeout: 5000,
		messages: []
	},
	{
		[CREATE_MESSAGE]: (state, action) => {
			const { id, content, timeout, dismissible } = action.payload;
			return update(state, {
				messages: {$unshift: [{id, content, timeout: (timeout || state.defaultTimeout), dismissible: dismissible === undefined || dismissible}]}
			});
		},
		[DESTROY_MESSAGE]: (state, action) => {
			const { id } = action.payload;
			const messageIndex = _.findIndex(state.messages, {id});
			if (messageIndex > -1) {
				return update(state, {
					messages: {$splice: [[messageIndex, 1]]}
				});
			} else {
				return state;
			}

		}
	}
);
