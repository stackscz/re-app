Modules are bundles of reducers, actions and sagas. These manage data of your app.

Module has single `redux` reducer mounted in app state on property with same name as module name is.

A module can depend on other module's actions and/or selectors (de-facto state). 
