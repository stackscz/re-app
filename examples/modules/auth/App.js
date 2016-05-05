/* eslint-disable */
import React from 'react';

import LabeledArea from 're-app-examples/LabeledArea';
import DevTools from 're-app/lib/components/DevTools';

import {app, container} from 're-app/lib/decorators';
import {createStore} from 're-app/lib/utils';
import apiModule from 're-app/lib/modules/api';
import authModule from 're-app/lib/modules/auth';
import {login, logout} from 're-app/lib/modules/auth/actions';
import LoginForm from './LoginForm';

import ApiService from 're-app/lib/mocks/ApiService'; // mock api service

const store = createStore({
	modules: [
		apiModule, // api module must be configured
		authModule
	]
}, {
	api: {
		service: ApiService
	}
});

@app(store)
@container(
	(state) => ({
		state,
		authErrors: state.auth.errors
	}),
	(dispatch) => ({
		login: (credentials) => {
			dispatch(login(credentials));
		},
		logout: () => {
			dispatch(logout());
		}
	})
)
export default class App extends React.Component {

	render() {
		const {login, logout, authErrors, state} = this.props;
		return (
			<div className="App">
				{state.auth.initialized && !state.auth.initializing ?
					<div className="well">
						{state.auth.user ?
							(
								<div>
									<p>Cool, now you can logout ...</p>
									<button className="btn btn-danger" onClick={logout}>logout</button>
								</div>
							) :
							(
								<div>
									<p>
										<small>pssss... correct credentials are <code>username/password</code></small>
									</p>
									{authErrors.length > 0 && <pre>{JSON.stringify(authErrors, null, 2)}</pre>}
									<LoginForm onLogin={login}/>
									{state.auth.authenticating &&
									<div><i className="fa fa-cog fa-spin fa-lg"/> initializing...</div>}
								</div>
							)
						}
					</div> :
					<div>
						<i className="fa fa-cog fa-spin fa-lg"/> logging in...
					</div>
				}

				<div className="row">
					<div className="col-xs-6">
						<LabeledArea title="Complete app state">
							<pre>{JSON.stringify(state, null, 2)}</pre>
						</LabeledArea>
					</div>
					<div className="col-xs-6">
						<LabeledArea title="Redux action log">
							<DevTools />
						</LabeledArea>
					</div>
				</div>
			</div>
		);
	}
}
