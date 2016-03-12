/* eslint-disable */
import _ from 'lodash';
import { createStore as reduxCreateStore, applyMiddleware, compose, combineReducers} from 'redux';
import { reduxReactRouter, routerStateReducer } from 'redux-router';
import DevTools from 're-app/components/DevTools';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

/**
 *
 *
 * @param config {Object} config.reducers - redux reducers, config.sagas - redux sagas
 * @param initialState
 * @returns {*}
 */
export default function createStore(config, initialState = {}) {

	let reducers = config.reducers ? {...config.reducers} : {};
	let sagas = config.sagas ? [...config.sagas] : [];

	const router = createRouter(config.routes);
	reducers.router = router.reducer;

	if (_.isArray(config.modules)) {
		_.each(config.modules, (module) => {
			if (module.reducers) {
				reducers = {...reducers, ...module.reducers};
			}
			if (module.sagas) {
				sagas = [...sagas, ...module.sagas];
			}
		});
	}

	var rootReducer = combineReducers(reducers);
	var sagaMiddleware = createSagaMiddleware(...sagas);

	rootReducer = compose(
		applyMiddleware(
			createLogger(),
			sagaMiddleware
		),
		router.enhancer,
		DevTools.instrument()
	)(reduxCreateStore)(rootReducer, initialState);

	return rootReducer;
}

function createRouter(routes) {

	let finalHistoryFactory = require('history/lib/createBrowserHistory');

	return {
		enhancer: reduxReactRouter({routes, createHistory: finalHistoryFactory}),
		reducer: routerStateReducer
	}
}


