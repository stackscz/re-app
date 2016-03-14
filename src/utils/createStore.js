/* eslint-disable */
import _ from 'lodash';
import { createStore as reduxCreateStore, applyMiddleware, compose, combineReducers} from 'redux';
import DevTools from 're-app/components/DevTools';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

export default function createStore(config, initialState = {}) {

	let reducers = config.reducers ? {...config.reducers} : {};
	let sagas = config.sagas ? [...config.sagas] : [];

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
		DevTools.instrument()
	)(reduxCreateStore)(rootReducer, initialState);

	return rootReducer;
}
