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
