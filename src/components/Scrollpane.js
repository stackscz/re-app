import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import ps from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';

export default class Scrollpane extends React.Component {

	componentDidMount() {
		if(canUseDOM) {
			this.$pane = ReactDOM.findDOMNode(this.refs.pane);
			ps.initialize(this.$pane);
		}
	}

	componentWillUnmount() {
		this.$pane && ps.destroy(this.$pane);
	}

	render() {
		const { children, style, otherProps} = this.props;
		return (
			<div ref="pane" {...otherProps} style={{position: 'relative', height: '100%'}}>
				<div>
					{children}
				</div>
			</div>
		);

	}
}

