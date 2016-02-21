/* eslint-disable */
import { createStore as reduxCreateStore, applyMiddleware, compose, combineReducers} from 'redux';
import { createDevTools } from 'redux-devtools';
import createLogger from 'redux-logger';

export default function createStore(reducers, initialState = {}) {
	var rootReducer = combineReducers(reducers);

	rootReducer = compose(
		applyMiddleware([
			createLogger()
		]),
		createDevTools()
	)(reduxCreateStore)(rootReducer, initialState);

	return rootReducer;
}
