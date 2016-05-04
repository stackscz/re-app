# `api`

Manages app state related to remote api server settings and ApiService implementation.

State shape:

    {
        "host": {
            "name": "example.com",
            "ssl": false
        },
        "service": {} // instance of ApiService implementation
    }

The whole state is treated as so called "apiContext" and is passed to `ApiService` methods.

### Depends on modules

none
