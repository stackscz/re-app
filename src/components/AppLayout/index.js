import React from 'react';
import Helmet from 'react-helmet';
import './index.less';
import classnames from 'classnames';
import { Scrollpane } from 're-app/components';
import { blissComponent } from 're-app/decorators';

@blissComponent
export default class AppLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false
		}
	}

	toggle() {
		this.setState({open: !this.state.open});
	}

	render() {
		const { bm, be, children, sidebar, header, footer } = this.props;
		const { open } = this.state;
		const moduleClassName = classnames({
			[bm()]: true,
			'AppLayout--hasHeader': header,
			'AppLayout--containerOpen': open
		});
		return (
			<div className={moduleClassName} id="app-container">
				<Helmet meta={[{name:"viewport", content:"width=device-width, initial-scale=1"}]}/>

				<div className={be('sidebar')}>
					<a className={be('sidebarToggle', null, 'visible-xs')} onClick={(e)=>{e.preventDefault(); this.toggle.apply(this)}}>
						<i className="fa fa-bars"/>
					</a>
					<div className={be('brand')} id="avatar">
						<div className="container-fluid">
							<div className="row">
								<div className="col-xs-4 col-xs-collapse-right">

								</div>
								<div id="avatar-col" className="col-xs-8 col-xs-collapse-left">

								</div>
							</div>
						</div>
					</div>
					<div dir="ltr" className={be('controls', null, 'sidebar-controls-container')}>
						<div className="sidebar-controls" tabIndex={-1}>
							<li tabIndex={-1} className="sidebar-control-btn"><a href="#" tabIndex={-1}><span
								className="AppLayout-icon fontello icon-fontello-docs"/></a></li>
							<li tabIndex={-1} className="sidebar-control-btn"><a href="#" tabIndex={-1}><span
								className="AppLayout-icon fontello icon-fontello-chat-1"/></a>
							</li>
							<li tabIndex={-1} className="sidebar-control-btn"><a href="#" tabIndex={-1}><span
								className="AppLayout-icon fontello icon-fontello-chart-pie-2"/></a></li>
							<li tabIndex={-1} className="sidebar-control-btn"><a href="#" tabIndex={-1}><span
								className="AppLayout-icon fontello icon-fontello-th-list-2"/></a></li>
							<li tabIndex={-1} className="sidebar-control-btn"><a href="#" tabIndex={-1}><span
								className="AppLayout-icon fontello icon-fontello-bell-5"/></a>
							</li>
						</div>
					</div>
					<div className={be('sidebarContent')}>
						<Scrollpane id="sidebar-container">
							{sidebar}
						</Scrollpane>
					</div>
				</div>
				{header &&
				<nav className={be('header')} role="navigation">
					<div className={be('headerContent')}>
						{header}
					</div>
				</nav>
				}
				<div className={be('content')} id="body">
					{children}
				</div>
				{footer && <div className={be('footer')} id="footer-container">
					<div id="footer" className="AppLayout-grid container-fluid text-center">
						{footer}
					</div>
				</div>}
			</div>
		);
	}
}

//<a onClick={(e)=>{e.preventDefault(); this.toggle.apply(this)}}>
//	<i className="AppLayout-icon fa fa-bars"/>
//</a>
