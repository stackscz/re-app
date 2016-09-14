/* eslint-disable react/no-multi-comp */
import React from 'react';
import { Router as ReactRouter, createRoutes } from 'react-router';
import createHistory from 'utils/createHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { setRoutes } from 'modules/routing/actions';

/**
 * Wraps component with react-router + redux-router
 *
 */
export default function router(store, configHistory) {
	return function wrapWithRouter(AppComponent) {
		const routes = AppComponent.getRoutes();
		const internalRoutes = createRoutes(routes);
		store.dispatch(setRoutes(internalRoutes));
		const history = syncHistoryWithStore(
			configHistory || createHistory(),
			store,
			{ selectLocationState: (state) => (state.reduxRouting) }
		);
		// history.listen((location) => {
		// 	store.dispatch(locationReached(location));
		// });

		class Container extends React.Component {

			constructor(props) {
				super(props);
				this.createRouteElement = this.createRouteElement.bind(this);
			}

			createRouteElement(Component, props) {
				class EnhancedRouteComponent extends React.Component {
					static childContextTypes = {
						routes: React.PropTypes.array,
					};

					getChildContext() {
						return {
							routes: internalRoutes,
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
						createElement={this.createRouteElement}
					/>
				);
			}
		}
		return Container;
	};
}
