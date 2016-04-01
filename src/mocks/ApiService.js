const API_LATENCY = 500;

export default {
	login: (credentials) => {

		return new Promise((resolve, reject) => {
			console.log('XXX XXX XXX XXX XXX XXX XXX');
			console.log('XXX Request running [LOGIN]');
			console.log('XXX XXX XXX XXX XXX XXX XXX');
			setTimeout(() => {

				if (Math.random() > 0.5) {
					resolve({
						user: {
							username: credentials.username
						},
						accessToken: {
							access_token: 'example_access_token_value',
							refresh_token: 'example_refresh_token_value',
							expires_in: 3600
						}
					});
				} else {
					reject({error: {message: 'Login failed.'}});
				}

			}, API_LATENCY);
		});

	},
	logout: () => {

		return new Promise(resolve => {
			console.log('XXX XXX XXX XXX XXX XXX XXX');
			console.log('XXX Request running [LOGOUT]');
			console.log('XXX XXX XXX XXX XXX XXX XXX');
			setTimeout(() => {
				resolve();
			}, API_LATENCY);
		});

	}
};
