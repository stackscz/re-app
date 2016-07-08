import 're-app-examples/index.less';

import React from 'react';
import { Route, IndexRoute, IndexRedirect, useRouterHistory } from 'react-router';

import ExamplesAppRoot from './ExamplesAppRoot';
import ExamplesHomeScreen from './ExamplesHomeScreen';
import ExampleGroupScreen from './ExampleGroupScreen';
import ExampleScreen from './ExampleScreen';
import ApiServiceExampleScreen from './ApiService';
import NotFoundScreen from './decorators/router/NotFoundScreen';

// import AppLayoutExample from './components/AppLayout';

import { app, router } from 're-app/lib/decorators';
import { createStore, createReducer } from 're-app/lib/utils';
import routingModule from 're-app/lib/modules/routing';

// create hash history implementation to overcome gh-pages limitations
import createHashHistory from 'history/lib/createHashHistory';
const history = useRouterHistory(createHashHistory)();

const store = createStore({
	logging: false,
	modules: [
		routingModule,
	],
	reducers: {
		repository: createReducer({
			rootUrl: 'https://github.com/stackscz/re-app/tree/master/',
		}),
	},
	router: {
		history, // use hash history, for now, put it as param to @router decorator, too! See below.
	},
});

@app(store)
@router(store, history)
export default class ExamplesRouter {
	static getRoutes() {
		return (
			<Route path="/">
				<IndexRedirect to="examples" />
				<Route path="examples" component={ExamplesAppRoot}>
					<IndexRoute name="home" component={ExamplesHomeScreen} />
					<Route
						path="api-service"
						name="api_service_example"
						component={ApiServiceExampleScreen}
					/>
					<Route path=":group" name="example_group" component={ExampleGroupScreen}>
						<Route path=":name" name="example" component={ExampleScreen} />
					</Route>
				</Route>
				<Route path="*" component={NotFoundScreen} />
			</Route>
		);
	}
}

// <Route path="examples/components/AppLayout" component={AppLayoutExample} />
