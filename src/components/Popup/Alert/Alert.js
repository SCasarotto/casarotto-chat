import React from 'react'
import PropTypes from 'prop-types'

import { Button, Text } from 'native-base'

import Popup from './../../utility/Popup'
import PopupTitle from './../../utility/PopupTitle'
import PopupMessage from './../../utility/PopupMessage'

import styles from './styles'

const Alert = (props) => {
	const { visible, animationType, title, message, onPress, buttonTitle, children } = props

	return (
		<Popup visible={visible} animationType={animationType}>
			<PopupTitle>{title}</PopupTitle>
			<PopupMessage>{message}</PopupMessage>
			{children}
			<Button onPress={onPress} block>
				<Text>{buttonTitle}</Text>
			</Button>
		</Popup>
	)
}

Alert.propTypes = {
	visible: PropTypes.bool,
	animationType: PropTypes.string,
	title: PropTypes.string,
	message: PropTypes.string,
	onPress: PropTypes.func.isRequired,
	buttonTitle: PropTypes.string,
}

Alert.defaultProps = {
	visible: false,
	animationType: 'fade',
	buttonTitle: 'Okay',
}

export default Alert
