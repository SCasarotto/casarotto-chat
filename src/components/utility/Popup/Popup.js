import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'

import styles from './styles'

class Popup extends Component {
	render() {
		const { visible, children, style } = this.props

		if (!visible) {
			return null
		}

		return (
			<View style={styles.background}>
				<View style={[styles.container, style]}>{children}</View>
			</View>
		)
	}
}

Popup.propTypes = {
	visible: PropTypes.bool,
	children: PropTypes.node,
}

Popup.defaultProps = {
	visible: false,
}

export default Popup
