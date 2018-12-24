import React, { Component } from 'react'
import {
	Container,
	Left,
	Body,
	Right,
	Content,
	Header,
	View,
	Text,
	Button,
	Icon,
	Drawer,
	List,
	ListItem,
	Input,
	Item,
	Spinner,
	Title,
	ActionSheet,
} from 'native-base'
import { Audio } from 'expo'

import styles from './styles'

class AudioCustom extends Component {
	state = { playingRecording: '', soundObject: undefined }

	handlePlayAudio = ({ audio, _id }) => {
		// await soundObject.loadAsync(source, initialStatus, downloadFirst);
		const { soundObject, playingRecording } = this.state

		if (soundObject) {
			soundObject
				.stopAsync()
				.then(() => {
					return soundObject.unloadAsync()
				})
				.then(() => {})
				.catch((error) => console.log(error))
		}

		if (playingRecording !== _id) {
			const newSoundObject = new Audio.Sound()
			newSoundObject
				.loadAsync({ uri: audio })
				.then((response) => {
					console.log('loadAsync', response)
					newSoundObject.setOnPlaybackStatusUpdate((statusData) => {
						const { didJustFinish } = statusData
						if (didJustFinish) {
							this.setState({ playingRecording: '', soundObject: undefined })
						}
					})
					return newSoundObject.playAsync()
				})
				.then(() => {
					this.setState({ playingRecording: _id, soundObject: newSoundObject })
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			this.setState({ playingRecording: '', soundObject: undefined })
		}
	}
	render() {
		const { playingRecording } = this.state
		const { containerStyle, currentMessage, user } = this.props
		const { audio, _id } = currentMessage

		if (audio) {
			return (
				<View style={containerStyle}>
					<Button
						block
						transparent
						style={styles.playPauseButton}
						onPress={() => this.handlePlayAudio({ audio, _id })}
					>
						{playingRecording === _id ? (
							<Icon
								type="Entypo"
								name="controller-stop"
								style={styles.playPauseIcon(currentMessage.user._id === user._id)}
							/>
						) : (
							<Icon
								type="Entypo"
								name="controller-play"
								style={styles.playPauseIcon(currentMessage.user._id === user._id)}
							/>
						)}
					</Button>
				</View>
			)
		}
		return null
	}
}

export default AudioCustom
