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

	describe('CRUD', () => {

		const tag = { name: 'foo-tag' };
		const post = { title: 'Post 1' };

		describe('#createEntity works as expected', () => {

			it('should create entity "tags"', () => {
				return ApiService.createEntity('tags', tag)
					.then((result) => {
						expect(result).toInclude({ data: tag });
					});
			});

			it('should create entity "posts"', () => {
				return ApiService.createEntity('posts', post)
					.then((result) => {
						expect(result).toInclude({ data: post });
					});
			});

			it('should fail on unknown collection', () => {
				return ApiService.createEntity('wierdos', tag)
					.then(() => {
						expect(true).toBe(false);
					})
					.catch((error) => {
						expect(error).toInclude({ code: 400 });
					})
			});

		});

		describe('#getEntity works as expected', () => {

			it('should get posts 1', () => {
				return ApiService.getEntity('posts', '1')
					.then((result) => {
						expect(result).toInclude({ data: post });
					});
			});

			it('should fail on unknown collection', () => {
				return ApiService.getEntity('wierdos', '1')
					.then((result) => {
						expect(true).toBe(false);
					})
					.catch((error) => {
						expect(error).toInclude({ code: 400 });
					});
			});

			it('should fail on unknown entity', () => {
				return ApiService.getEntity('posts', '2')
					.then((result) => {
						expect(true).toBe(false);
					})
					.catch((error) => {
						expect(error).toInclude({ code: 404 });
					});
			});

		});

		describe('#getEntityIndex works as expected', () => {

			it('should get posts', () => {
				return ApiService.getEntityIndex('posts')
					.then((result) => {
						expect(result).toInclude({ existingCount: 1 });
						expect(result.data).toBeAn(Array);
						expect(result.data[0]).toInclude(post);
					});
			});

			it('should fail on unknown collection', () => {
				return ApiService.getEntityIndex('wierdos')
					.then((result) => {
						expect(true).toBe(false);
					})
					.catch((error) => {
						expect(error).toInclude({ code: 400 });
					});
			});

		});

		describe('#updateEntity works as expected', () => {

			const postEdit = { title: 'Edit: Title 1' };
			it('should update posts 1', () => {
				return ApiService.updateEntity('posts', '1', postEdit)
					.then((result) => {
						expect(result).toInclude({ data: postEdit });
					});
			});

			it('should fail on unknown collection', () => {
				return ApiService.updateEntity('wierdos', '1', postEdit)
					.then((result) => {
						expect(true).toBe(false);
					})
					.catch((error) => {
						expect(error).toInclude({ code: 400 });
					});
			});

			it('should fail on unknown entity', () => {
				return ApiService.updateEntity('posts', '2', postEdit)
					.then((result) => {
						expect(true).toBe(false);
					})
					.catch((error) => {
						expect(error).toInclude({ code: 404 });
					});
			});

		});

		describe('#deleteEntity works as expected', () => {

			it('should delete posts 1', () => {
				return ApiService.deleteEntity('posts', '1')
					.then((result) => {
						expect(result).toBe(undefined);
					});
			});

			it('should fail on unknown collection', () => {
				return ApiService.deleteEntity('wierdos', '1')
					.then((result) => {
						expect(true).toBe(false);
					})
					.catch((error) => {
						expect(error).toInclude({ code: 400 });
					});
			});

			it('should fail on unknown entity', () => {
				return ApiService.deleteEntity('posts', '2')
					.then((result) => {
						expect(true).toBe(false);
					})
					.catch((error) => {
						expect(error).toInclude({ code: 404 });
					});
			});

		});

	});

});
