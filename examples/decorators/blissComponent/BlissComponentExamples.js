import React from 'react';
import BlessedComponent from './BlessedComponent';

export default class BlissComponentExamples extends React.Component {
	render() {
		return (
			<div className="ExampleGroup">
				<div className="ExampleGroup-item">
					<pre>
						&lt;BlessedComponent /&gt;
					</pre>
					<BlessedComponent />
				</div>
				<div className="ExampleGroup-item">
					<pre>
						&lt;BlessedComponent modifiers=&quot;sm&quot;/&gt;
					</pre>
					<BlessedComponent modifiers="sm"/>
				</div>
				<div className="ExampleGroup-item">
					<pre>
						&lt;BlessedComponent modifiers=&quot;lg&quot;/&gt;
					</pre>LabeledArea>
					<BlessedComponent modifiers="lg"/>
				</div>
				<div className="ExampleGroup-item">
					<pre>
						&lt;BlessedComponent modifiers=&quot;sm intense&quot;/&gt;
					</pre>
					<BlessedComponent modifiers="sm intense"/>
				</div>
				<div className="ExampleGroup-item">
					<pre>
						&lt;BlessedComponent modifiers=&quot;lg mint&quot;/&gt;
					</pre>
					<BlessedComponent modifiers="lg mint"/>
				</div>
				<div className="ExampleGroup-item">
					<pre>
						&lt;BlessedComponent modifiers=&quot;lg mint excentric&quot;/&gt;
					</pre>
					<BlessedComponent modifiers="lg mint excentric"/>
				</div>
			</div>
		);
	}
}
