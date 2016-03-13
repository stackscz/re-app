/* eslint-disable */
import 're-app-examples/index.less';

import React from 'react';
import {Route, IndexRoute, DefaultRoute} from 'react-router';

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

const store = createStore({
	modules: [
		routingModule
	]
});

@app(store)
@router(store)
export default class App {
	static getRoutes() {
		return (
			<Route path="/" component={Layout}>
				<IndexRoute name="dashboard" component={Dashboard}/>
				<Route path="profile/:username" component={Profile}>
					<IndexRoute name="profile_basic_info" component={BasicInfo} />
					<Route name="profile_sessions" path="sessions" component={Sessions} />
				</Route>
				<Route name="listing" path="my-list" component={Listing}/>
				<Route path="*" component={NotFoundScreen} />
			</Route>
		);
	}
}
