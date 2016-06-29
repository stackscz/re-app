import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import './index.less';

const DevToolsComponent = createDevTools(
	<LogMonitor className="DevTools" />
);

export default class DevTools extends React.Component {
	static instrument = DevToolsComponent.instrument;

	render() {
		return (
			<div className="DevTools">
				<DevToolsComponent />
			</div>
		);
	}
}
