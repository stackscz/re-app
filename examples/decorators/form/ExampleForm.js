/* eslint-disable react/prop-types, max-len */
import React from 'react';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { form, blissComponent, fieldWithErrors as wrapWithErrors } from 're-app/lib/decorators';
import Btn from 're-app/lib/components/Btn';
import PasswordField from 're-app/lib/components/PasswordField';
import PasswordStrength from 're-app/lib/components/PasswordStrength';
import PaperOrientationInput from './PaperOrientationInput';
import schema from '!!json!./schema.json';
import errorMessages from './errorMessages';

const renderField = ({ input }) => <input {...input} />;

const fieldWithError = wrapWithErrors(renderField);
const passwordFieldWithError = wrapWithErrors(PasswordField);
const paperFieldWithError = wrapWithErrors(PaperOrientationInput);

const ExampleForm = props => {
	const {
		handleSubmit,
		bm,
		password,
	} = props;
	const onSubmit = data => {
		console.log('SUBMIT:', data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={bm()}>

			<h3>Name</h3>
			First name:
			<Field
				name="person.first_name"
				component={fieldWithError}
			/>

			Last name:
			<Field
				name="person.last_name"
				component={fieldWithError}
			/>

			<h3>Address</h3>
			Street:
			<Field
				name="person.address.street"
				component={fieldWithError}
			/>

			Street number:
			<Field
				name="person.address.street_number"
				component={fieldWithError}
			/>

			City:
			<Field
				name="person.address.city"
				component={fieldWithError}
			/>

			Country:
			<Field
				name="person.address.country"
				component={fieldWithError}
			/>

			<h3>Password</h3>
			Password:
			<Field
				name="password"
				component={passwordFieldWithError}
			/>
			{password &&
				<PasswordStrength
					password={password}
				/>
			}

			<h3>Paper orientation</h3>
			Paper orientation:
			<Field
				name="orientation"
				component={paperFieldWithError}
			/>

			<Btn>Send</Btn>

			<div>
				<h1>WildForm props</h1>
				<pre>{JSON.stringify(props, null, 2)}</pre>
			</div>

		</form>
	);
};

const BlissExampleForm = blissComponent(ExampleForm);

const ExampleReduxForm = form({
	form: 'example-form',
	errorMessages,
	schema,
})(BlissExampleForm);

const selector = formValueSelector('example-form');

export default connect(
	state => {
		const password = selector(state, 'password');
		return {
			password,
		};
	}
)(ExampleReduxForm);
