// @flow
import _ from 'lodash';
import { createStore as reduxCreateStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createHistory from 'utils/createHistory';
import { reducer as formReducer } from 'redux-form';
import { init } from 'utils/actions';

import type StoreConfig from 'types/StoreConfig';
import type RouterConfig from 'types/RouterConfig';

function createRouter(routerConfig:RouterConfig = {}) {
	const finalHistory = routerConfig.history || createHistory();

	return {
		middleware: routerMiddleware(finalHistory),
		routing: routerReducer,
	};
}

function runSaga(sagaMiddleware:Function, saga:Function):void {
	sagaMiddleware.run(saga);
	// TODO logging
	//	.done.catch((error) => {
	//		console.log(error);
	//		runSaga(sagaMiddleware, saga);
	//	});
}

export default function createStore(config:StoreConfig = {}, initialState = {}):Object {
	let reducers = config && config.reducers ? { ...config.reducers } : {};
	let sagas = config && config.sagas ? [...config.sagas] : [];
	const enhancers = config && config.enhancers ? [...config.enhancers] : [];

	const router = createRouter(config.router);
	reducers.reduxRouting = router.routing;
	reducers.form = formReducer;

	if (config && _.isArray(config.modules)) {
		_.each(config.modules, (module) => {
			if (module.reducers) {
				reducers = { ...reducers, ...module.reducers };
			}
			if (module.sagas) {
				sagas = [...sagas, ...module.sagas];
			}
		});
	}

	const sagaMiddleware = createSagaMiddleware();
	const middleware = [
		sagaMiddleware,
		router.middleware,
	];
	if (process.env.NODE_ENV !== 'production') {
		if (config.logging !== false) {
			middleware.push(require('redux-logger')());
		}
	}

	enhancers.unshift(applyMiddleware(...middleware));

	// use batched updates?
	let batchedSubscribeFunc = null;
	if (process.env.UNIVERSAL_ENV !== 'server') {
		const batchedSubscribe = require('redux-batched-subscribe').batchedSubscribe;
		// avoid dependency on react-dom on server
		const batchedUpdates = require('react-dom').unstable_batchedUpdates;
		batchedSubscribeFunc = batchedSubscribe(batchedUpdates);
	}

	const rootReducer = combineReducers(reducers);
	const store = compose(...enhancers)(reduxCreateStore)(
		rootReducer,
		initialState,
		batchedSubscribeFunc
	);
	store.dispatch(init());
	if (sagas.length) {
		sagas.forEach((saga) => runSaga(sagaMiddleware, saga));
	}
	return store;
}
