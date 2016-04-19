/* eslint-disable */
import React from 'react';
import Select from 're-app/components/Select';

export default class DynamicEntityFormField extends React.Component {

	static propTypes = {
		schema: React.PropTypes.object.isRequired,
		controlProps: React.PropTypes.object.isRequired
	};

	_renderFieldControl() {
		const { controlProps } = this.props;
		return (
			<input type="text" className="form-control" {...controlProps} />
		);
	}

	render() {

		const { schema, controlProps } = this.props;

		return (
			<div>
				<label>
					<div>
						{schema.label}
					</div>
					<div>
						{this._renderFieldControl()}
					</div>
				</label>
			</div>
		);
	}
}
