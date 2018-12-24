import React from 'react'
import PropTypes from 'prop-types'

import { Button, Text, View } from 'native-base'

import Popup from './../../utility/Popup'
import PopupTitle from './../../utility/PopupTitle'
import PopupMessage from './../../utility/PopupMessage'

import styles from './styles'

const Confirm = (props) => {
	const {
		visible,
		animationType,
		title,
		message,
		leftOnPress,
		leftButtonTitle,
		rightOnPress,
		rightButtonTitle,
		children,
	} = props

	return (
		<Popup visible={visible} animationType={animationType}>
			<PopupTitle>{title}</PopupTitle>
			<PopupMessage>{message}</PopupMessage>
			{children}
			<View style={styles.buttonContainer}>
				<Button style={styles.button} onPress={leftOnPress} block>
					<Text>{leftButtonTitle}</Text>
				</Button>
				<Button style={styles.button} onPress={rightOnPress} block>
					<Text>{rightButtonTitle}</Text>
				</Button>
			</View>
		</Popup>
	)
}

Confirm.propTypes = {
	visible: PropTypes.bool,
	animationType: PropTypes.string,
	title: PropTypes.string,
	message: PropTypes.string,
	leftOnPress: PropTypes.func.isRequired,
	leftButtonTitle: PropTypes.string,
	rightOnPress: PropTypes.func.isRequired,
	rightButtonTitle: PropTypes.string,
}

Confirm.defaultProps = {
	visible: false,
	animationType: 'fade',
}

export default Confirm
