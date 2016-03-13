import React from 'react';
import {Provider} from 'react-redux';

/**
 * Wraps component with react-redux Provider to create app component
 *
 */
export default function app(store) {
	return function wrapWithApp(WrappedComponent) {
		class Container extends React.Component {
			render() {
				return (
					<Provider store={store}>
						<WrappedComponent />
					</Provider>
				);
			}
		}
		return Container;
	};
}
