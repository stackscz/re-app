import React from 'react';

export default (props) => (
	<form className="form-signin" onSubmit={(e) => {
		const { onLogin } = props;
		e.preventDefault();
		const inputs = e.target.getElementsByTagName('input');
		onLogin({
			username: inputs[0].value,
			password: inputs[1].value
		});
	}}>
		<label htmlFor="inputEmail" className="sr-only">
			Username
		</label>
		<input type="text" id="inputEmail" className="form-control" placeholder="Email address"/>
		<label htmlFor="inputPassword" className="sr-only">
			Password
		</label>
		<input type="password" id="inputPassword" className="form-control" placeholder="Password"/>
		<button className="btn btn-success" type="submit">Sign in</button>
	</form>
);
