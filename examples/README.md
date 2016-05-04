<p>
    <code>re-app</code> integrates several killer libraries into opinionated, terribly evil framework,
    to provide base needed for modern web application development.
</p>
<p>
    This website features usage examples of <code>re-app</code> library in form of sample applications.
    This very website itself is example of routing setup and can be found in <code>examples/ExamplesRouter.js</code>.
    Appception!
</p>
<p>Some integrated libs:</p>
<ul>
    <li>
        <code>axios</code> for http
    </li>
    <li>
        <code>normalizr</code> and <code>denormalizr</code> for data normalization and denormalization
    </li>
    <li>
        <code>react</code> for view
    </li>
    <li>
        <code>react-router</code> for routing
    </li>
    <li>
        <code>redux</code> for app state
    </li>
    <li>
        <code>redux-saga</code> for side effects
    </li>
    <li>
        <a href="https://github.com/stackscz/re-app/tree/master/package.json" target="_blank">package.json</a>
    </li>
</ul>


# Creating project from scratch with <a href="https://github.com/stackscz/re-app-builder" target="_blank">`re-app-builder` <i class="fa fa-external-link"></i></a>


`cd` into empty project directory and run these commands

    npm init # initialize your project as npm package
    npm i --save-dev re-app-builder # install re-app-builder
    npm i --save-dev re-app # install re-app


Create `public/index.html`

    <!DOCTYPE html>
    <html>
        <head></head>
        <body>
            <div id="root"></div>
            <script src="/index.js"></script>
        </body>
    </html>

    
Create `src/index.js`, for example:

    /* eslint-disable */
    import _ from 'lodash';
    import React from 'react';
    import ReactDOM from 'react-dom';
    
    function *generator() { // generator functions supported
    
    }
    
    class App extends React.Component {
        render() {
            return (
                <strong>cool</strong> // jsx supported
            );
        }
    }
    
    ReactDOM.render(<App/>, document.getElementById('root'));


Merge following into your `package.json` (add `re-app-builder` script)

    {"scripts": {"ab": "node ./node_modules/re-app-builder"}}


Run

    npm run ab dev


Look at [http://127.0.0.1:8080]()
