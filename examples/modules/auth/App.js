import React, { PropTypes as T } from 'react';

import LabeledArea from 're-app-examples/LabeledArea';
import LabeledJsonInspector from 're-app-examples/LabeledJsonInspector';
import DevTools from 're-app-examples/DevTools';

import { app, container } from 're-app/lib/decorators';
import { createStore } from 're-app/lib/utils';
import apiModule from 're-app/lib/modules/api';
import entityDescriptorsModule from 're-app/lib/modules/entityDescriptors';
import entityStorageModule from 're-app/lib/modules/entityStorage';
import authModule from 're-app/lib/modules/auth';
import { login, logout } from 're-app/lib/modules/auth/actions';
import LoginForm from './LoginForm';

import ApiService from 're-app/lib/mocks/ApiService'; // mock api service

const store = createStore(
	{
		modules: [
			apiModule, // api module must be configured
			entityDescriptorsModule, // api module must be configured
			entityStorageModule, // api module must be configured
			authModule,
		],
		enhancers: [
			DevTools.instrument(),
		],
	},
	{
		api: {
			service: ApiService,
		},
		auth: {
			userModelName: 'users',
		},
		entityDescriptors: {
			schemas: {
				users: {
					name: 'users',
					idFieldName: 'username',
					displayFieldName: 'username',
					isFilterable: false,
					fields: {
						id: {
							name: 'id',
							type: 'Number',
						},
						username: {
							name: 'username',
							type: 'String',
						},
					},
				},
			},
		},
	}
);

@app(store)
@container(
	(state) => ({
		state,
		error: state.auth.error,
	}),
	(dispatch) => ({
		handleLogin: (credentials) => {
			dispatch(login(credentials));
		},
		handleLogout: () => {
			dispatch(logout());
		},
	})
)
export default class App extends React.Component {

	static propTypes = {
		handleLogin: T.func,
		handleLogout: T.func,
		error: T.object,
		state: T.any,
	};

	render() {
		const { handleLogin, handleLogout, error, state } = this.props;
		return (
			<div className="App">
				{
					state.auth.initialized && !state.auth.initializing ? (
						<div className="well">
							{
								state.auth.userId ? (
									<div>
										<p>Cool, now you can logout ...</p>
										<button className="btn btn-danger" onClick={handleLogout}>logout</button>
									</div>
								) : (
									<div>
										<p>
											<small>pssss... correct credentials are <code>username/password</code>
											</small>
										</p>
										{error && (
											<pre>{JSON.stringify(error, null, 2)}</pre>
										)}
										<LoginForm onLogin={handleLogin} />
										{
											state.auth.authenticating && (
												<div><i className="fa fa-cog fa-spin fa-lg" /> logging in...</div>
											)
										}
									</div>
								)
							}
						</div>
					) : (
						<div className="well">
							<i className="fa fa-cog fa-spin fa-lg" /> initializing...
						</div>
					)
				}

				<div className="row">
					<div className="col-xs-6">
						<LabeledJsonInspector title="Complete app state" data={state} />
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
