import { createCheckedReducer } from 're-app/utils';
import { SET_HOST } from './actions';

import { t } from 'redux-tcomb';

export default createCheckedReducer(
	t.struct({
		host: t.maybe(t.struct({
			name: t.String,
			ssl: t.Boolean
		})),
		service: t.maybe(t.Object)
	}),
	{
		host: null,
		service: null
	},
	{
		[SET_HOST]: (state, action) => {
			const { name, ssl } = action.payload;
			return {...state, host: {name, ssl}};
		}
	}
);
