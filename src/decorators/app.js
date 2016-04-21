import React from 'react';
import { Provider } from 'react-redux';
import { container } from 're-app/decorators';

/**
 * Wraps component with react-redux Provider to create app component
 *
 */
export default function app(store, isStateReady, splashElement) {
	return function wrapWithApp(WrappedComponent) {

		@container((state) => ({isStateReady: !isStateReady || isStateReady(state)}))
		class Container extends React.Component {
			render() {
				const { isStateReady } = this.props;
				return isStateReady ? (<WrappedComponent />) : (splashElement || <i>Loading&hellip;</i>);
			}
		}

		class AppProvider extends React.Component {
			render() {
				return (
					<Provider store={store}>
						<Container />
					</Provider>
				);
			}
		}
		return AppProvider;
	};
}
