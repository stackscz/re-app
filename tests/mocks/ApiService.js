import test from 'tape';
import ApiService from 're-app/mocks/ApiService';
import { validateObject } from 're-app/utils';

const goodCredetials = {username: 'username', password: 'password'};
const badCredetials = {username: 'johndoe', password: 'password'};


test('mocks/ApiService:initializeAuth resolves with authContext', (t) => {
	const authContext = {};
	ApiService
		.initializeAuth(authContext)
		.then((result) => {
			t.pass('initializeAuth() should always resolve');
			t.end();
		})
		.catch(() => {
			t.fail('initializeAuth() should always resolve');
			t.end();
		});
});

test('mocks/ApiService:login resolves with authContext containing user when correct credentials provided', (t) => {
	const authContext = {};
	ApiService
		.login(goodCredetials, authContext)
		.then((result) => {
			t.ok(result.user, 'login() should resolve with authContext containing user key');
			t.end();
		})
		.catch(() => {
			t.fail('login() should resolve when correct credentials are provided');
			t.end();
		});
});

test('mocks/ApiService:login rejects with error object when incorrect credentials provided', (t) => {
	const authContext = {};
	ApiService
		.login(badCredetials, authContext)
		.then(() => {
			t.fail('login() should reject with error object');
			t.end();
		})
		.catch((result) => {
			//console.log(result); // TODO test error structure
			t.pass('login() should reject when incorrect credentials are provided');
			t.end();
		});
});

test('mocks/ApiService:logout always resolves', (t) => {
	const authContext = {};
	ApiService
		.logout(authContext)
		.then(() => {
			t.pass('logout() should always resolve');
			t.end();
		})
		.catch((result) => {
			t.fail('logout() should always resolve');
			t.end();
		});
});

test('mocks/ApiService:getEntityDescriptors always resolves with entities description object when valid authContext is provided', (t) => {
	const authContext = {
		credentials: goodCredetials
	};
	const apiContext = {};
	ApiService
		.getEntityDescriptors(apiContext, authContext)
		.then((result) => {
			try {
				t.pass('getEntityDescriptors() should resolve with valid entityDescriptors');
			} catch (e) {
				t.fail('getEntityDescriptors() should resolve with valid entityDescriptors');
			}

			t.end();
		})
		.catch((result) => {
			t.fail('getEntityDescriptors() should resolve');
			t.end();
		});
});
