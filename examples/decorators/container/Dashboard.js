import React, { PropTypes as T } from 'react';
import { container } from 're-app/lib/decorators';

import LabeledArea from 're-app-examples/LabeledArea';
import DevTools from 're-app-examples/DevTools';

@container(
	state => ({ data: state.someDataSlice }), // mapStateToProps
	dispatch => ({ // mapDispatchToProps
		addItem: () => dispatch({ type: 'ADD_ITEM' }),
	})
)
export default class Dashboard extends React.Component {

	static propTypes = {
		data: T.any,
		addItem: T.func,
	};

	render() {
		const {
			addItem,
			data,
			} = this.props;
		return (
			<div className="Dashboard">
				<h1>My awesome dashboard</h1>
				<div className="well">
					<button className="btn btn-success" onClick={addItem}>Add item</button>
				</div>
				<div className="row">
					<div className="col-xs-6">
						<LabeledArea title="Dashboard props">
							<pre>{JSON.stringify(data, null, 2)}</pre>
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
