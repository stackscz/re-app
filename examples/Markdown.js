import React, { PropTypes as T } from 'react';
import marked from 'marked';

export default class Markdown extends React.Component {

	static propTypes = {
		content: T.string.isRequired,
	};

	createMarkupFromContent() {
		const { content } = this.props;
		return { __html: marked(content) };
	}


	render() {
		return (
			<div className="Markdown" dangerouslySetInnerHTML={this.createMarkupFromContent()}></div>
		);
	}
}
