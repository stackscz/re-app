/* eslint-disable react/prop-types */
import React, { Component, PropTypes as T } from 'react';
import { blissComponent } from 'decorators';
import Btn from 'components/Btn';

@blissComponent
export default class PasswordField extends Component {

	static propTypes = {
		icon: T.string,
		input: T.object,
	}

	static defaultProps = {
		icon: 'eye',
	}

	constructor(props) {
		super(props);
		this.state = {
			show: false,
		};
		this.handleToggleShowPassword = this.handleToggleShowPassword.bind(this);
	}

	handleToggleShowPassword() {
		this.setState({
			show: !this.state.show,
		});
	}

	render() {
		const { icon, input, bm, be } = this.props;
		const { show } = this.state;
		return (
			<div className={bm(null, show ? 'isShown' : '')}>
				<input className={be('input')} type={show ? 'text' : 'password'} {...input} />
				<span className={be('button')}>
					<Btn
						type="button"
						onClick={this.handleToggleShowPassword}
						icon={icon}
					/>
				</span>
			</div>
		);
	}
}
