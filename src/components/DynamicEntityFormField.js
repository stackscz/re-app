/* eslint-disable */
import React from 'react';
import Select from 're-app/components/Select';
import Checkbox from 're-app/components/Checkbox';
//import Quill from 'react-quill';
//import 'quill/dist/quill.snow.css';

export default class DynamicEntityFormField extends React.Component {

	static propTypes = {
		schema: React.PropTypes.object.isRequired,
		controlProps: React.PropTypes.object.isRequired
	};

	_renderFieldControl() {
		const { schema, controlProps } = this.props;
		switch (schema.type) {
			case 'boolean':
				const { value, ...otherControlProps } = controlProps;
				return (
					<Checkbox {...otherControlProps} checked={value} />
				);
			case 'integer':
				return (
					<input type="number" step="1" className="form-control" {...controlProps} />
				);
			case 'decimal':
				return (
					<input type="number" step=".01" className="form-control" {...controlProps} />
				);
			//case 'wysiwyg':
			//	return (
			//		<Quill theme="snow" {...controlProps} />
			//	);
			default:
				return (
					<input type="text" className="form-control" {...controlProps} />
				);
		}
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
