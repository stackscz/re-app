import React, { PropTypes as T } from 'react';
import Component from 'react-pure-render/component';
import _ from 're-app/utils/lodash';

export default class Select extends Component {

	static propTypes = {
		onChange: T.func.isRequired,
		onBlur: T.func,
		multiple: T.bool,
		value: T.any,
		options: T.array.isRequired,
		optionIdProp: T.string,
		optionLabelProp: T.string,
		optionValueProp: T.string,
	};

	static defaultProps = {
		optionIdProp: 'id',
		optionLabelProp: 'name',
	};

	parseValue(event) {
		const { multiple, options, optionIdProp, optionValueProp } = this.props;
		if (multiple) {
			const result = [];
			for (let index = 0; index < event.target.selectedOptions.length; index++) {
				result.push(_.revealNumber(event.target.selectedOptions[index].value));
			}
			const selectedOptions = _.filter(
				options,
				(option) => _.includes(result, option[optionIdProp] || option)
			);
			return optionValueProp ?
				_.map(selectedOptions, (option) => option[optionValueProp]) :
				selectedOptions;
		}
		const value = _.revealNumber(event.target.value);
		const selectedOption = _.find(options, { [optionIdProp]: value });
		return (optionValueProp ? selectedOption[optionValueProp] : selectedOption) || value;
	}

	render() {
		const {
			multiple,
			onBlur,
			onChange,
			value,
			options,
			optionIdProp,
			optionLabelProp,
			...otherProps,
			} = this.props;
		return (
			<select
				className="form-control"
				multiple={multiple}
				onBlur={event => onBlur && onBlur(this.parseValue.apply(this, [event]))}
				onChange={event => onChange(this.parseValue.apply(this, [event]))}
				value={value}
				{...otherProps}
			>
				{!multiple && <option value={null}>-</option>}
				{options.map((option) => {
					let content = option[optionLabelProp] || option;
					if (_.isObject(content)) {
						content = content[optionIdProp];
					}
					return (
						<option value={option[optionIdProp] || option} key={option[optionIdProp] || option}>
							{content}
						</option>
					);
				})}
			</select>
		);
	}
}
