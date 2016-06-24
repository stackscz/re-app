import React, { PropTypes as T } from 'react';
import Btn from 'components/Btn';

export default class BackBtn extends React.Component {

	static propTypes = {
		children: T.node,
	};

	static contextTypes = {
		router: T.object,
	};

	constructor(props) {
		super(props);
		this.goBack = this.goBack.bind(this);
	}

	goBack() {
		this.context.router.goBack();
	}

	render() {
		const { children, ...others } = this.props;
		return (
			<Btn {...others} onClick={this.goBack}>{children}</Btn>
		);
	}

}
