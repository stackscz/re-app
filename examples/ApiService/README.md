# `ApiService`

`api` module must have implementation of ApiService set in it's state. 
It provides opaque adapter to remote api. Handles authentication and entity storage.

Instance of ApiService should be set in initial state of application.

    const initialState = {
        api: {
            service: ApiService
        }
    }
