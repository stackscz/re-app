/* eslint-disable react/prop-types */
import React from 'react';
import ErrorMessages from 'components/ErrorMessages';
import blissComponent from 'decorators/blissComponent';

/**
 * Add enhance redux-form field component with error messages and label
 *
 */
const RichField = ({
	component: Component,
	input: {
		label,
		name,
		type,
		value,
		placeholder,
		onBlur,
		onChange,
		onFocus,
		onDrop,
		onDragStart,
		...otherInputProps,
	},
	error,
	touched,
	bm,
}) =>
	<div className={bm()}>
		<label>
			{label}
			<Component
				input={{
					name,
					type,
					value,
					placeholder,
					onBlur,
					onChange,
					onFocus,
					onDrop,
					onDragStart,
				}}
				{...otherInputProps}
			/>
		</label>
		{touched && error && <ErrorMessages error={error} />}
	</div>;

export default blissComponent(RichField);
