# `re-app`

Common `react` components, `redux`, `react-router`, `redux-router`, `redux-saga` boilerplate and helper codebase

## Development

To build re-app one time, run 

    npm run build

To watch changes in sources and build on the fly run
    
    npm run build:watch

Resulting CommonJS build files are located in `lib` directory.

To develop examples, run
    
    npm run ab dev

Website featuring `re-app` examples will then be served on http://127.0.0.1:8080

## Testing

Tests are stored in `tests` folder. Run them by executing `npm run test` (you have to have `babel-node` installed globally, `npm install -g babel-cli`).
You can also run only one test file by running `npm run test:file path/to/test`.

## Proposed library structure

### utils

Here will be list of utility functions

### components

Here will be list of pure components

### containers

Here will be list of container components (aka smart components)

### decorators

Here will be list of decorators providing common functionality

### modules

Module is a bundle of related `redux` actions, `redux` reducer, `redux-saga`s and selector functions.
A module can depend on selector functions and actions of another module.

#### api

Keeps api service

#### auth

Keeps authentication context of application

#### routing

Handles routing actions and state

#### flash

Handles flash messages

#### modals

Handles modal windows

#### entityDescriptors

Keeps entity schemas and normalizr schemas (here called "mappings" for separation)

#### entityStorage

Handles entity data

#### entityIndexes

Handles lists of entities

#### entityEditors

Handles entity editors

## Dependency tree of internal modules

Dependency root is a module with no dependencies. A module depends on every module on oriented paths leading to dependency roots. There should be no cycles.
See the proposed tree [here](http://knsv.github.io/mermaid/live_editor/#/edit/Z3JhcGggUkwKCmFwaQpyb3V0aW5nCmF1dGgKYXV0aCAtLT4gYXBpCmVudGl0eURlc2NyaXB0b3JzCmVudGl0eURlc2NyaXB0b3JzIC0tPiBhcGkKZW50aXR5U3RvcmFnZQplbnRpdHlTdG9yYWdlIC0tPiBlbnRpdHlEZXNjcmlwdG9ycwplbnRpdHlJbmRleGVzCmVudGl0eUluZGV4ZXMgLS0-IGVudGl0eVN0b3JhZ2UKZW50aXR5RWRpdG9ycwplbnRpdHlFZGl0b3JzIC0tPiBlbnRpdHlTdG9yYWdlCmZsYXNoCm1vZGFscw)
