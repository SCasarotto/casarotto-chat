import React, { Component } from 'react'
import { View, Button, Icon } from 'native-base'
import { Audio } from 'expo-av'

import styles from './styles'

class AudioCustom extends Component {
	state = { playingRecording: '', soundObject: undefined }

	handlePlayAudio = ({ audio, _id }) => {
		// await soundObject.loadAsync(source, initialStatus, downloadFirst);
		const { soundObject, playingRecording } = this.state

		//If playing - stop
		if (soundObject) {
			soundObject
				.stopAsync()
				.then(() => {
					return soundObject.unloadAsync()
				})
				.then(() => {})
				.catch((error) => console.log(error))
		}

		//If id id different than last id play new
		if (playingRecording !== _id) {
			Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
				playsInSilentModeIOS: true,
				shouldDuckAndroid: true,
				interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
				playThroughEarpieceAndroid: false,
				staysActiveInBackground: false,
			})
				.then(() => {
					const newSoundObject = new Audio.Sound()
					newSoundObject
						.loadAsync({ uri: audio })
						.then((response) => {
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
				})
				.catch((e) => console.log(e))
		} else {
			//If id is the same reset state
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
								type='Entypo'
								name='controller-stop'
								style={styles.playPauseIcon(currentMessage.user._id === user._id)}
							/>
						) : (
							<Icon
								type='Entypo'
								name='controller-play'
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
