/* eslint-disable react/no-multi-comp */
import React, { PropTypes as T } from 'react';
import _ from 'lodash';
import { Provider } from 'react-redux';
import container from 'decorators/container';

/**
 * Wraps component with react-redux Provider to create app component
 *
 */
export default function app(store, isStateReadySelector, splashElement) {
	return function wrapWithApp(WrappedComponent) {
		@container(
			(state) => ({
				isStateReady: !_.isFunction(isStateReadySelector) || isStateReadySelector(state),
			})
		)
		class Container extends React.Component {

			static propTypes = {
				isStateReady: T.bool,
			}

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
