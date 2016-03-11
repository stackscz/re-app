/* eslint-disable */
import { createStore as reduxCreateStore, applyMiddleware, compose, combineReducers} from 'redux';
import DevTools from 're-app/components/DevTools';
import createLogger from 'redux-logger';

export default function createStore(reducers, initialState = {}) {
	var rootReducer = combineReducers(reducers);

	rootReducer = compose(
		applyMiddleware(
			createLogger()
		),
		DevTools.instrument()
	)(reduxCreateStore)(rootReducer, initialState);

	return rootReducer;
}
