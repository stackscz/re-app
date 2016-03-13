import React from 'react';
import {Provider} from 'react-redux';
import DevTools from 're-app/components/DevTools';

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
						<div>
							<WrappedComponent />
							<DevTools />
						</div>
					</Provider>
				);
			}
		}
		return Container;
	};
}
