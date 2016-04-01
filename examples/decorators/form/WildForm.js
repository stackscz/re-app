import React from 'react';
import {form} from 're-app/decorators';
import PaperOrientationInput from './PaperOrientationInput';

@form({
	fields: [
		'username',
		{
			name: 'password',
			validations: {
				presence: true,
				format: {
					pattern: /^[a-z]+$/,
					message: 'has to contain only lowercase letters.'
				}
			}
		},
		{
			name: 'orientation',
			validations: {
				presence: {
					message: 'is bad'
				},
				format: {
					pattern: 'horizontal',
					message: 'is bad'
				}
			}
		}
	]
})
export default class WildForm extends React.Component {

	handleSubmit(data) {
		console.log(data);
	}

	render() {
		const {fields, handleSubmit} = this.props;
		return (
			<form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>

				<input {...fields.username}/>
				<pre>{JSON.stringify(fields.username.error, null, 2)}</pre>

				<input {...fields.password}/>
				<pre>{JSON.stringify(fields.password.error, null, 2)}</pre>

				<PaperOrientationInput {...fields.orientation} />
				<pre>{JSON.stringify(fields.orientation.error, null, 2)}</pre>

				<button>send</button>

				<div>
					<h1>WildForm props</h1>
					<pre>{JSON.stringify(this.props, null, 2)}</pre>
				</div>


			</form>
		);
	}
}