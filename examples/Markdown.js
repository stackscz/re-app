import React from 'react';
import marked from 'marked';

export default class Markdown extends React.Component {

	static propTypes = {
		content: React.PropTypes.string.isRequired
	};

	createMarkupFromContent() {
		const { content } = this.props;
		return {__html: marked(content)};
	}


	render() {
		return (
			<div className="Markdown" dangerouslySetInnerHTML={this.createMarkupFromContent()}></div>
		);
	}
}
