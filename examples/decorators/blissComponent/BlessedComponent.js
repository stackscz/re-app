import React from 'react';
import {blissComponent} from 're-app/decorators';
import './BlessedComponent.less';

@blissComponent
export default class BlessedComponent extends React.Component {
	render() {
		const {getBlissModuleClassName: bm, getBlissElementClassName: be} = this.props;
		// ... or use shortcuts directly
		//const {bm, be} = this.props;
		return (
			<div className={bm()}>
				<div className={be('header')}>
					Header
				</div>
				<div className={be('content')}>
					<div className={be('section')}>
						Content 1
					</div>
					<div className={be('section')}>
						Content 2
					</div>
					<div className={be('section', 'last')}>
						Content 3 (last)
					</div>
				</div>
				<div className={be('footer')}>
					Footer
				</div>
			</div>
		);
	}
}
