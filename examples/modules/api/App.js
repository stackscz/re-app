import React, { PropTypes as T } from 'react';

import { app, container } from 're-app/lib/decorators';
import { createStore } from 're-app/lib/utils';
import ApiService from 're-app/lib/mocks/ApiService';
import apiModule from 're-app/lib/modules/api';
import { setHost } from 're-app/lib/modules/api/actions';

import Select from 're-app/lib/components/Select';
import Checkbox from 're-app/lib/components/Checkbox';

import LabeledArea from 're-app-examples/LabeledArea';
import LabeledJsonInspector from 're-app-examples/LabeledJsonInspector';
import DevTools from 're-app-examples/DevTools';

const store = createStore(
	{
		modules: [
			apiModule,
		],
		enhancers: [
			DevTools.instrument(),
		],
	},
	{
		api: {
			host: {
				name: 'example.com',
				ssl: true,
			},
			service: ApiService,
		},
	}
);

@app(store)
@container(
	(state) => ({ // mapStateToProps
		state,
		api: state.api,
	}),
	(dispatch) => ({ // mapDispatchToProps
		handleSetHost: (ssl, name) => {
			dispatch(setHost(ssl, name));
		},
	})
)
export default class App extends React.Component {

	static propTypes = {
		handleSetHost: T.func,
		state: T.any,
		api: T.any,
	}

	constructor(props) {
		super(props);
		this.setSsl = this.setSsl.bind(this);
		this.setHostname = this.setHostname.bind(this);
	}

	setHostname(name) {
		const { handleSetHost, api } = this.props;
		handleSetHost(api.host.ssl, name);
	}

	setSsl(ssl) {
		const { handleSetHost, api } = this.props;
		handleSetHost(ssl, api.host.name);
	}

	render() {
		const { state, api: { host } } = this.props;
		return (
			<div className="App">
				<div className="well">
					<label>
						<Select
							options={['example.com', 'example2.com']}
							onChange={this.setHostname}
							value={host.name}
						/>
					</label>
					<label>
						<Checkbox
							onChange={this.setSsl}
							checked={host.ssl}
						/>
						SSL
					</label>
				</div>
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
