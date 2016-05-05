import _ from 'lodash';
import { createStore as reduxCreateStore, applyMiddleware, compose, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createHistory from 're-app/utils/createHistory';
import { reducer as formReducer } from 'redux-form';

export default function createStore(config = {}, initialState = {}) {

	let reducers = config && config.reducers ? {...config.reducers} : {};
	let sagas = config && config.sagas ? [...config.sagas] : [];

	const router = createRouter(config.router);
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

	const sagaMiddleware = createSagaMiddleware();
	const middleware = [
		sagaMiddleware,
		router.middleware
	];
	if (process.env.NODE_ENV === 'development') {
		middleware.push(require('redux-immutable-state-invariant')());
		middleware.push(require('redux-logger')());
	}

	const enhancers = [applyMiddleware(...middleware)];
	if (process.env.NODE_ENV === 'development') {
		enhancers.push(require('re-app/components/DevTools').default.instrument());
	}

	var rootReducer = combineReducers(reducers);
	const store = compose(...enhancers)(reduxCreateStore)(rootReducer, initialState);
	if (sagas.length) {
		sagaMiddleware.run(...sagas);
	}
	return store;
}

function createRouter(routerConfig = {}) {

	const finalHistory = routerConfig.history || createHistory();

	return {
		middleware: routerMiddleware(finalHistory),
		routing: routerReducer
	};
}


