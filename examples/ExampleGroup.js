import React from 'react';
import './index.less';

export default class ExampleGroup extends React.Component {

	static propTypes = {
		tabLinks: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
	};

	render() {
		const { tabLinks, children } = this.props;
		return (
			<div className="ExampleGroup">
				<ul className="ExampleGroup-nav nav nav-tabs">
					{tabLinks.map((link, index) => {
						return <li key={index}>{ link }</li>;
					})}
				</ul>
				<div className="ExampleGroup-body">
					{ children }
				</div>
			</div>
		);
	}
}
