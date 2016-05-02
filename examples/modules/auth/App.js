import React from 'react';

import {app, container} from 're-app/decorators';
import {createStore} from 're-app/utils';
import apiModule from 're-app/modules/api';
import authModule from 're-app/modules/auth';
import ApiService from 're-app/mocks/ApiService';
import {login, logout} from 're-app/modules/auth/actions';

import LabeledArea from 're-app-examples/LabeledArea';

const store = createStore({
	modules: [
		apiModule,
		authModule
	]
}, {
	api: {
		service: ApiService
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
				<div className="well">
					{this.props.state.auth.user ?
						<button className="btn btn-danger" onClick={logout}>logout</button> :
						<button className="btn btn-success" onClick={login}>login</button>
					}
				</div>
				<LabeledArea title="complete app state">
					<pre>{JSON.stringify(this.props.state, null, 2)}</pre>
				</LabeledArea>
			</div>
		);
	}
}
