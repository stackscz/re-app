/* eslint-disable */
import { createReducer } from 're-app/utils';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOCATION_REACHED, SET_ROUTES } from './actions';

export default createReducer({}, {
	[LOCATION_CHANGE]: (state, action) => {
		return {...state, location: action.payload};
	},
	[SET_ROUTES]: (state, action) => {
		return {...state, routes: action.payload};
	}
});
