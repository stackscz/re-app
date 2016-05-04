# `auth`

Manages app state related to user authentication.

Initial module state shape:

    {
        user: null, // structure of "user" property value is arbitrary
        errors: [],
        initializing: false,
        initialized: false,
        authenticating: false,
    }

The whole state is treated as so called "authContext" and is passed to `ApiService` methods. 
Some of these can return or resolve with new authContext to reflect context changes. 
Therefore `ApiService` can store access tokens or other data in app state.

### Depends on modules

- `api`
