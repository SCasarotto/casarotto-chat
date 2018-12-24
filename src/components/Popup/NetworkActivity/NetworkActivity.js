import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'

import { Spinner } from 'native-base'

import Popup from './../../utility/Popup'

import { colors } from './../../../config/styles'
import styles from './styles'

const NetworkActivity = (props) => {
	const { visible, size, message } = props
	return (
		<Popup visible={visible} transparent>
			<Spinner color={colors.primary} />
			<Text style={styles.message}>{message}</Text>
		</Popup>
	)
}

NetworkActivity.propTypes = {
	visible: PropTypes.bool,
	size: PropTypes.oneOf(['large', 'small']),
	message: PropTypes.string,
}

NetworkActivity.defaultProps = {
	size: 'large',
}

export default NetworkActivity
