/* eslint-disable react/prop-types */

import React from 'react';
import ErrorMessages from 'components/ErrorMessages';
import blissComponent from 'decorators/blissComponent';

/**
 * Add error message to a redux-form field component
 *
 */
@blissComponent
export default FieldComponent =>
	class FieldWithErrors extends React.Component {
		render() {
			const { error, touched, bm } = this.props;
			return (
				<div className={bm()}>
					<FieldComponent {...this.props} />
					{touched && error && <ErrorMessages error={error} />}
				</div>
			);
		}
	};

