import React, { PropTypes as T } from 'react';

export default class LabeledArea extends React.Component {

	static propTypes = {
		title: T.string.isRequired,
		children: T.node,
	};

	render() {
		const { title, children } = this.props;
		return (
			<div className="LabeledArea panel panel-default">
				<div className="panel-heading">
					{title}
				</div>
				<div className="panel-body">
					{children}
				</div>
			</div>
		);
	}
}
