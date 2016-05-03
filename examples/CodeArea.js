import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-twilight.css';
import './CodeArea.less';

export default class CodeArea extends React.Component {

	static propTypes = {
		title: React.PropTypes.string,
		code: React.PropTypes.string,
		language: React.PropTypes.string.isRequired
	};

	static defaultProps = {
		language: 'jsx'
	};

	getHighlightedCode() {
		const { children, code } = this.props;
		return {__html: Prism.highlight(children || code, Prism.languages.js)};
	}

	render() {
		const { title, language } = this.props;
		const codeClassName = 'language-' + language;
		return (
			<div className="CodeArea panel panel-default">
				{title &&
				<div className="CodeArea-title panel-heading">
					{ title }
				</div>
				}
				<div className="CodeArea-code panel-body">
					<pre>
						<code className={codeClassName} dangerouslySetInnerHTML={this.getHighlightedCode()}></code>
					</pre>
				</div>
			</div>
		);
	}
}
