/* eslint-disable */
import React from 'react';
import {reduxForm} from 'redux-form';
import parseFormConfig from 're-app/utils/parseFormConfig';

/**
 * Wraps component with redux-form enhanced with validation
 *
 */
export default function form(config, mapStateToProps, mapDispatchToProps, mergeProps, options) {
	const {fieldNames, ...reduxConfig} = parseFormConfig(config);
	return function wrapWithForm(WrappedComponent) {
		@reduxForm(reduxConfig, mapStateToProps, mapDispatchToProps, mergeProps, options)
		class FormContainer extends React.Component {
			render() {
				return (
					<WrappedComponent {...this.props} fieldNames={fieldNames} />
				);
			}
		}
		return FormContainer;
	};
}
