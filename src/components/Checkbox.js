import React, { PropTypes as T } from 'react';
import Component from 'react-pure-render/component';

export default class Checkbox extends Component {

	static propTypes = {
		onChange: T.func.isRequired,
		onBlur: T.func,
		checked: T.bool,
		children: T.node,
	};

	static defaultProps = {
		checked: false,
	};

	parseValue(event) {
		return event.target.checked;
	}

	render() {
		const {
			onChange,
			onBlur,
			...otherProps,
			} = this.props;
		return (
			<input
				type="checkbox"
				onBlur={event => onBlur && onBlur(this.parseValue.apply(this, [event]))}
				onChange={event => onChange(this.parseValue.apply(this, [event]))}
				{...otherProps}
			/>
		);
	}
}
