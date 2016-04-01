import React from 'react';
import {Btn} from 're-app/components';

export default class BackBtn extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	goBack() {
		this.context.router.goBack();
	}

	render() {
		const {children, ...others} = this.props;
		return (
			<Btn {...others} onClick={this.goBack.bind(this)}>{children}</Btn>
		);
	}

}
