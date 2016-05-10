import React from 'react';

export default class LabeledArea extends React.Component {

	static propTypes = {
		title: React.PropTypes.string.isRequired
	};

	render() {
		const { title, children } = this.props;
		return (
			<div className="LabeledArea panel panel-default">
				<div className="panel-heading">
					{ title }
				</div>
				<div className="panel-body">
					{ children }
				</div>
			</div>
		);
	}
}
