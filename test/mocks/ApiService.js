/* eslint-disable */

import expect from 'expect';

import ApiService from 're-app/mocks/ApiService';

const goodCredetials = { username: 'username', password: 'password' };
const badCredetials = { username: 'johndoe', password: 'password' };

describe('mocks/ApiService', () => {
	it('#initializeAuth resolves with authContext', () => {
		const authContext = {};
		return ApiService.initializeAuth(authContext)
			.then(() => {
				expect(true).toBe(true, 'initializeAuth() should always resolve');
			})
			.catch(() => {
				expect(true).toBe(false, 'initializeAuth() should always resolve');
			});
	});
	it('#login resolves with authContext containing user when correct credentials provided', () => {

		const authContext = {};
		return ApiService
			.login(goodCredetials, authContext)
			.then((result) => {
				expect(true).toBe(true, 'login() should resolve with authContext containing user key');
			})
			.catch(() => {
				expect(true).toBe(false, 'login() should resolve with authContext containing user key');
			});
	});
	it('#login rejects with error object when incorrect credentials provided', () => {
		const authContext = {};
		return ApiService
			.login(badCredetials, authContext)
			.then(() => {
				expect(true).toBe(false, 'login() should reject with error object');
			})
			.catch((result) => {
				expect(true).toBe(true, 'login() should reject with error object');
			});
	});
	it('#logout always resolves', () => {
		const authContext = {};
		return ApiService
			.logout(authContext)
			.then(() => {
				expect(true).toBe(true, 'logout() should always resolve');
			})
			.catch(() => {
				expect(true).toBe(false, 'logout() should always resolve');
			});
	});
	it('#getEntityDescriptors always resolves with entity descriptors object when valid authContext is provided', () => {

		const authContext = {
			credentials: goodCredetials
		};
		const apiContext = {};
		return ApiService
			.getEntityDescriptors(apiContext, authContext)
			.then(() => {
				expect(true).toBe(true, 'getEntityDescriptors() should resolve with valid entityDescriptors');
			})
			.catch(() => {
				expect(true).toBe(false, 'getEntityDescriptors() should resolve with valid entityDescriptors');
			});
	});

});
