import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { hideAlert, hideConfirm } from './../../actions'

import Alert from './../Popup/Alert'
import NetworkActivity from './../Popup/NetworkActivity'
import Confirm from './../Popup/Confirm'

class PageWrapper extends Component {
	handleAlertClose = () => {
		this.props.hideAlert()
	}
	handleConfirmClose = () => {
		this.props.hideConfirm()
	}

	render() {
		const {
			children,
			alertIsVisible,
			alertTitle,
			alertMessage,
			networkActivityIsVisible,
			networkMessage,
			confirmTitle,
			confirmMessage,
			confirmIsVisible,
			confirmLeftTitle,
			confirmRightOnClick,
			confirmRightTitle,
		} = this.props
		return (
			<Fragment>
				{children}
				<Confirm
					title={confirmTitle}
					message={confirmMessage}
					visible={confirmIsVisible}
					leftOnPress={this.handleConfirmClose}
					leftButtonTitle={confirmLeftTitle}
					rightOnPress={confirmRightOnClick}
					rightButtonTitle={confirmRightTitle}
				/>
				<Alert
					title={alertTitle}
					message={alertMessage}
					visible={alertIsVisible}
					onPress={this.handleAlertClose}
				/>
				<NetworkActivity message={networkMessage} visible={networkActivityIsVisible} />
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => {
	const {
		alertIsVisible,
		alertTitle,
		alertMessage,
		networkActivityIsVisible,
		networkMessage,
		confirmTitle,
		confirmMessage,
		confirmIsVisible,
		confirmLeftTitle,
		confirmRightOnClick,
		confirmRightTitle,
	} = state.Global

	return {
		alertIsVisible,
		alertTitle,
		alertMessage,
		networkActivityIsVisible,
		networkMessage,
		confirmTitle,
		confirmMessage,
		confirmIsVisible,
		confirmLeftTitle,
		confirmRightOnClick,
		confirmRightTitle,
	}
}

export default connect(
	mapStateToProps,
	{ hideAlert, hideConfirm }
)(PageWrapper)
