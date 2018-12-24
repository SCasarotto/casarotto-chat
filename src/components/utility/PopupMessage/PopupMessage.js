import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'

import styles from './styles'

const PopupMessage = ({ children }) => <Text style={styles.message}>{children}</Text>

PopupMessage.propTypes = {
	children: PropTypes.string,
}

export default PopupMessage
