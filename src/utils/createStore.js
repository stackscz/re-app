/* eslint-disable */
import _ from 'lodash';
import { createStore as reduxCreateStore, applyMiddleware, compose, combineReducers} from 'redux';
import DevTools from 're-app/components/DevTools';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import {browserHistory} from 'react-router';
import { reducer as formReducer } from 'redux-form';

export default function createStore(config, initialState = {}) {

	let reducers = config && config.reducers ? {...config.reducers} : {};
	let sagas = config && config.sagas ? [...config.sagas] : [];

	const router = createRouter();
	reducers.reduxRouting = router.routing;
	reducers.form = formReducer;

	if (config && _.isArray(config.modules)) {
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
			router.middleware,
			sagaMiddleware
		),
		DevTools.instrument()
	)(reduxCreateStore)(rootReducer, initialState);

	return rootReducer;
}

function createRouter() {

	let finalHistoryFactory = browserHistory;

	return {
		middleware: routerMiddleware(finalHistoryFactory),
		routing: routerReducer
	}
}


