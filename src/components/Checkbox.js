/* eslint-disable */
import React from 'react';
import Component from 'react-pure-render/component';
import { PropTypes } from 'react';
import _ from 're-app/utils/lodash';

export default class Checkbox extends Component {

	_parseValue(event) {
		return event.target.checked;
	}

	render() {
		const { onChange, onBlur, value, ...otherProps } = this.props;
		return (
			<input type="checkbox"
				   onBlur={event => onBlur && onBlur(this._parseValue.apply(this, [event]))}
				   onChange={event => onChange(this._parseValue.apply(this, [event]))}
				{...otherProps}/>
		);
	}
}
