import React from 'react';
import { Router as ReactRouter, createRoutes } from 'react-router';
import createHistory from 're-app/utils/createHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { actions as routingActions } from 're-app/modules/routing';

/**
 * Wraps component with react-router + redux-router
 *
 */
export default function router(store) {
	return function wrapWithRouter(AppComponent) {
		const routes = AppComponent.getRoutes();
		const internalRoutes = createRoutes(routes);
		const history = syncHistoryWithStore(createHistory(), store, {selectLocationState: (state) => (state.reduxRouting)});

		store.dispatch(routingActions.setRoutes(internalRoutes));

		class Container extends React.Component {

			createRouteElement(Component, props) {

				class EnhancedRouteComponent extends React.Component {
					static childContextTypes = {
						routes: React.PropTypes.array
					};

					getChildContext() {
						return {
							routes: internalRoutes
						};
					}

					render() {
						return <Component {...this.props} />;
					}
				}

				return (
					<EnhancedRouteComponent {...props} />
				);
			}

			render() {
				return (
					<ReactRouter
						history={history}
						routes={routes}
						createElement={this.createRouteElement.bind(this)}
					/>
				);
			}
		}
		return Container;
	};
}
