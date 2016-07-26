import React, { PropTypes as T } from 'react';
import ModalContent from 'components/ModalContent';

export default class ModalCenter extends React.Component {

	static propTypes = {
		children: T.node,
	};

	render() {
		const {
			children,
			} = this.props;

		return (
			<div
				className="ModalCenter-table"
				style={{ outline: 'none', display: 'table', width: '100%', height: '100%' }}
			>
				<div
					className="ModalCenter-row"
					style={{ display: 'table-row' }}
				>
					<div
						className="ModalCenter-cell"
						style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}
					>
						<div
							className="ModalCenter-contentWrapper"
							style={{ display: 'inline-block', textAlign: 'left' }}
						>
							<ModalContent>
								{children}
							</ModalContent>
						</div>
					</div>
				</div>
			</div>
		);
	}

}
