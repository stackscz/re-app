import React from 'react';
import _ from 'lodash';

import { AppLayout } from 're-app/lib/components';

export default class AppLayoutExample extends React.Component {
	render() {
		return (
			<AppLayout
				sidebar={_.map(_.range(100), (i) =>
							<div key={i}>
								<br/>
								<br/>
								Item {i}
								<br/>
								<br/>
							</div>
						)}
				header={<strong>HEADER</strong>}
			>
				{_.map(_.range(100), (i) =>
					<div key={i}>
						<br/>
						<br/>
						<a id={'item-'+i}>Item {i}</a>
						<br/>
						<br/>
					</div>
				)}
			</AppLayout>
		);

	}
}
