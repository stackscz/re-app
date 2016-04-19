/* eslint-disable */
import React from 'react';
import Component from 'react-pure-render/component';
import { PropTypes } from 'react';
import _ from 're-app/utils/lodash';

export default class Select extends Component {

	static propTypes = {
		onChange: PropTypes.func.isRequired,
		value: PropTypes.any,
		options: PropTypes.array.isRequired,
		optionIdProp: PropTypes.string,
		optionLabelProp: PropTypes.string,
		optionValueProp: PropTypes.string
	};

	static defaultProps = {
		optionIdProp: 'id',
		optionLabelProp: 'name'
	};

	_parseValue(event) {
		const { multiple, options, optionIdProp, optionValueProp } = this.props;
		if (multiple) {
			const result = [];
			for (let index = 0; index < event.target.selectedOptions.length; index++) {
				result.push(_.revealNumber(event.target.selectedOptions[index].value))
			}
			const selectedOptions = _.filter(options, (option) => {
				return _.includes(result, option[optionIdProp])
			});
			return optionValueProp ? _.map(selectedOptions, (option) => option[optionValueProp]) : selectedOptions;
		}
		const value = _.revealNumber(event.target.value);
		const selectedOption = _.find(options, {[optionIdProp]: value});
		return optionValueProp ? selectedOption[optionValueProp] : selectedOption;
	}

	render() {
		const { multiple, onBlur, onChange, value, options, optionIdProp, optionLabelProp, ...otherProps } = this.props;
		return (
			<select
				className="form-control"
				multiple={multiple}
				onBlur={event => onBlur(this._parseValue.apply(this, [event]))}
				onChange={event => onChange(this._parseValue.apply(this, [event]))}
				value={value}
				{...otherProps}>
				{!value && <option>---</option>}
				{options.map((option) => {
					return (
						<option value={option[optionIdProp]} key={option[optionIdProp]}>
							{option[optionLabelProp]}
						</option>
					)
				})}
			</select>
		);
	}
}
