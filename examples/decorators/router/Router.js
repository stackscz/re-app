import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Layout from './Layout';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Listing from './Listing';
import BasicInfo from './BasicInfo';
import Sessions from './Sessions';
import NotFoundScreen from './NotFoundScreen';

import {app, router} from 're-app/decorators';
import {createStore} from 're-app/utils';
import routingModule from 're-app/modules/routing';

// create in-memory history implementation to avoid conflict with parent app
import createMemoryHistory from 'history/lib/createMemoryHistory';
import { useRouterHistory } from 'react-router';
const history = useRouterHistory(createMemoryHistory)();

const store = createStore({
	modules: [
		routingModule // routing module
	],
	router: {
		history // use in-memory history, for now, put it as param to @router decorator, too! See below.
	}
});

// use decorators to create app with routing
@app(store)
@router(store, history) // use in-memory history
export default class Router {
	static getRoutes() {
		return (
			<Route path="/" component={Layout}>
				<IndexRoute name="dashboard" component={Dashboard}/>
				<Route path="profile/:username" component={Profile}>
					<IndexRoute name="profile_basic_info" component={BasicInfo}/>
					<Route name="profile_sessions" path="sessions" component={Sessions}/>
				</Route>
				<Route name="listing" path="my-list" component={Listing}/>
				<Route path="*" component={NotFoundScreen}/>
			</Route>
		);
	}
}
