import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'

import styles from './styles'

const PopupTitle = ({ children }) => <Text style={styles.title}>{children}</Text>

PopupTitle.propTypes = {
	children: PropTypes.string,
}

export default PopupTitle
