/* eslint-disable */
import React from 'react';
import {reduxForm} from 'redux-form';
import parseFormFields from 'utils/parseFormFields';

/**
 * Wraps component with redux-form enhanced with validation
 *
 */
export default function form(config = {}) {
	const {fields, validate} = parseFormFields(config.fields);
	return function wrapWithForm(WrappedComponent) {
		@reduxForm({...config, fields, validate})
		class FormContainer extends React.Component {
			render() {
				return (
					<WrappedComponent {...this.props} />
				);
			}
		}
		return FormContainer;
	};
}
