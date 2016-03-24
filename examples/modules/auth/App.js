import 're-app-examples/index.less';

import React from 'react';
import {DevTools} from 're-app/components';

import {app, container} from 're-app/decorators';
import {createStore, createReducer} from 're-app/utils';
import authModule from 're-app/modules/auth';
import ApiService from 're-app/mocks/ApiService';
import {login, logout} from 're-app/modules/auth/actions';

const store = createStore({
	modules: [
		authModule
	],
	reducers: {
		apiService: createReducer(ApiService)
	}
});

@app(store)
@container(
	(state) => ({state}),
	(dispatch) => ({
		login: () => {
			dispatch(login('example_username', 'example_password'));
		},
		logout: () => {
			dispatch(logout());
		}
	})
)
export default class App extends React.Component {

	render() {
		const {login, logout} = this.props;
		return (
			<div className="App">
				<pre>{JSON.stringify(this.props.state, null, 2)}</pre>
				<button onClick={login}>login</button>
				<button onClick={logout}>logout</button>
				<DevTools />
			</div>
		);
	}
}
