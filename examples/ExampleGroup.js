import React, { PropTypes as T } from 'react';
import './index.less';

export default class ExampleGroup extends React.Component {

	static propTypes = {
		children: T.node,
		tabLinks: T.arrayOf(T.element).isRequired,
	};

	render() {
		const { tabLinks, children } = this.props;
		return (
			<div className="ExampleGroup">
				<ul className="ExampleGroup-nav nav nav-tabs">
					{tabLinks.map((link, index) => (
						<li key={index}>{link}</li>
					))}
				</ul>
				<div className="ExampleGroup-body">
					{children}
				</div>
			</div>
		);
	}
}
