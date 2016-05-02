import 're-app-examples/index.less';

import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import ExamplesAppRoot from './ExamplesAppRoot';
import ExamplesHomeScreen from './ExamplesHomeScreen';
import ExampleScreen from './ExampleScreen';
import NotFoundScreen from './decorators/router/NotFoundScreen';

import {app, router} from 're-app/decorators';
import {createStore, createReducer} from 're-app/utils';
import routingModule from 're-app/modules/routing';

// create hash history implementation to overcome gh-pages limitations
import createHashHistory from 'history/lib/createHashHistory';
import { useRouterHistory } from 'react-router';
const history = useRouterHistory(createHashHistory)();

const store = createStore({
	modules: [
		routingModule
	],
	reducers: {
		repository: createReducer({rootUrl: 'https://github.com/stackscz/re-app/tree/master/'})
	},
	router: {
		history // use in-memory history, for now, put it as param to @router decorator, too! See below.
	}
});

@app(store)
@router(store, history)
export default class ExamplesRouter {
	static getRoutes() {
		return (
			<Route path="/">
				<IndexRedirect to="examples"/>
				<Route path="examples" component={ExamplesAppRoot}>
					<IndexRoute name="home" component={ExamplesHomeScreen}/>
					<Route path=":group" name="example_group" component={ExampleScreen}/>
					<Route path=":group/:name" name="example" component={ExampleScreen}/>
				</Route>
				<Route path="*" component={NotFoundScreen}/>
			</Route>
		);
	}
}
