import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Constants from 'expo-constants'
import { Audio } from 'expo-av'
import * as Speech from 'expo-speech'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { Notifications } from 'expo'

import { Container, Left, Body, Right, Header, View, Button, Icon, Drawer } from 'native-base'
import { Clipboard, AppState } from 'react-native'

import { startWatchingUser, startWatchingChat, sendImage, sendAudio } from './../../actions'

import PageWrapper from './../../components/PageWrapper'
import Confirm from './../../components/Popup/Confirm'

import Sidebar from './Sidebar'
import AudioCustom from './AudioCustom'

import { sentNotifications } from './../../helpers'
import styles from './styles'

class Main extends Component {
	state = {
		numberOfMessagesToLoad: 15,
		recording: undefined,
		recordingActive: false,
		recordAudioVisible: false,
		playingRecording: '',
	}
	async componentDidMount() {
		const { numberOfMessagesToLoad } = this.state
		const { startWatchingUser, startWatchingChat } = this.props
		startWatchingUser()
		startWatchingChat(numberOfMessagesToLoad)

		try {
			if (Constants.isDevice) {
				//Only Run On Devices. Will Crash in emulators
				const getResponse = await Permissions.getAsync(Permissions.NOTIFICATIONS)
				const { uid } = firebase.auth().currentUser
				//Save it to DB for debugging
				firebase
					.database()
					.ref(`/Users/${uid}`)
					.update({
						pushPermissions: getResponse,
					})
				switch (response.status) {
					case 'granted': {
						const token = await Notifications.getExpoPushTokenAsync()
						firebase
							.database()
							.ref(`/Users/${uid}`)
							.update({
								exponentPushToken: token,
							})
						break
					}
					case 'undetermined':
					case 'denied': {
						const askResponse = await Permissions.askAsync(Permissions.NOTIFICATIONS)
						if (askResponse.status !== 'granted') {
							return
						}
						const token = await Notifications.getExpoPushTokenAsync()
						firebase
							.database()
							.ref(`/Users/${uid}`)
							.update({
								exponentPushToken: token,
							})
					}
					default:
						break
				}
			}
		} catch (e) {
			console.log(e)
		}

		//Reset On Load or On Background -> Active
		Notifications.setBadgeNumberAsync(0)
		AppState.addEventListener('change', (appState) => {
			if (appState === 'active') {
				Notifications.setBadgeNumberAsync(0)
			}
		})
	}
	closeDrawer = () => {
		this.drawer._root.close()
	}
	openDrawer = () => {
		this.drawer._root.open()
	}
	onSend = (messages) => {
		const { user } = this.props
		firebase
			.database()
			.ref('Chat')
			.push({ ...messages[0], createdAt: firebase.database.ServerValue.TIMESTAMP })
			.then(() => {
				sentNotifications({ user, type: 'message', message: messages[0].text })
			})
			.catch((error) => console.log(error))
	}
	onLongPress = (context, currentMessage) => {
		if (currentMessage.text) {
			const options = ['Text To Speech', 'Copy Text', 'Cancel']
			const cancelButtonIndex = options.length - 1
			context.actionSheet().showActionSheetWithOptions(
				{
					options,
					cancelButtonIndex,
				},
				(buttonIndex) => {
					switch (buttonIndex) {
						case 0:
							Speech.speak(currentMessage.text)
							break
						case 1:
							Clipboard.setString(currentMessage.text)
							break
					}
				},
			)
		}
	}
	renderAccessory = () => (
		<View style={styles.actionRow}>
			<Button block style={styles.actionButton('#8e81ab')} onPress={this.handleTakeImage}>
				<Icon type='Entypo' name='camera' />
			</Button>
			<Button block style={styles.actionButton('#ff7373')} onPress={this.handleUploadImage}>
				<Icon type='Entypo' name='upload' />
			</Button>
			<Button
				block
				style={styles.actionButton('#4dbedf')}
				onPress={this.handleStartAudioRecording}
			>
				<Icon type='MaterialIcons' name='record-voice-over' />
			</Button>
		</View>
	)
	renderCustomView = (props) => {
		if (props.currentMessage.audio) {
			return <AudioCustom {...props} />
		}
		return null
	}
	handleUploadImage = () => {
		Permissions.askAsync(Permissions.CAMERA_ROLL)
			.then((response) => {
				const { status, expires, permissions } = response
				if (status === 'granted') {
					ImagePicker.launchImageLibraryAsync({
						// mediaTypes: 'All',
						base64: true,
						quality: 1,
					})
						.then((response) => {
							if (!response.cancelled) {
								const { user, sendImage } = this.props
								//TODO: Check if it is a video and store video
								const data = { uri: response.uri, user }
								sendImage(data)
							}
						})
						.catch((error) => console.log(error))
				}
			})
			.catch((error) => console.log(error))
	}
	handleTakeImage = () => {
		Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
			.then((response) => {
				const { status, expires, permissions } = response
				if (status === 'granted') {
					ImagePicker.launchCameraAsync({
						// mediaTypes: 'All',
						base64: true,
						quality: 1,
					})
						.then((response) => {
							if (!response.cancelled) {
								const { user, sendImage } = this.props
								//TODO: Check if it is a video and store video
								const data = { uri: response.uri, user }
								sendImage(data)
							}
						})
						.catch((error) => console.log(error))
				}
			})
			.catch((error) => console.log(error))
	}
	handleStartAudioRecording = () => {
		Audio.setAudioModeAsync({
			allowsRecordingIOS: true,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
			playThroughEarpieceAndroid: false,
			staysActiveInBackground: false,
		})
			.then((response) => {
				return Permissions.askAsync(Permissions.AUDIO_RECORDING)
			})
			.then((response) => {
				const { status, expires, permissions } = response
				if (status === 'granted') {
					const newRecording = new Audio.Recording()
					newRecording
						.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
						.then((response) => {
							return newRecording.startAsync()
						})
						.then((response) => {
							this.setState({
								recordingActive: true,
								recording: newRecording,
								recordAudioVisible: true,
							})
						})
						.catch((error) => console.log(error))
				}
			})
			.catch((error) => {
				console.log(error)
				Audio.setAudioModeAsync({
					allowsRecordingIOS: false,
					interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
					playsInSilentModeIOS: true,
					shouldDuckAndroid: true,
					interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
					playThroughEarpieceAndroid: false,
					staysActiveInBackground: false,
				})
			})
	}
	handleCloseAudioRecoding = () => {
		const { recordingActive, recording } = this.state

		recording
			.stopAndUnloadAsync()
			.then((response) => {
				this.setState({
					recordingActive: false,
					recording: undefined,
					recordAudioVisible: false,
				})
				Audio.setAudioModeAsync({
					allowsRecordingIOS: false,
					interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
					playsInSilentModeIOS: true,
					shouldDuckAndroid: true,
					interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
					playThroughEarpieceAndroid: false,
					staysActiveInBackground: false,
				})
			})
			.catch((error) => {
				console.log(error)
				Audio.setAudioModeAsync({
					allowsRecordingIOS: false,
					interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
					playsInSilentModeIOS: true,
					shouldDuckAndroid: true,
					interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
					playThroughEarpieceAndroid: false,
					staysActiveInBackground: false,
				})
			})
	}
	handleSendAudioReecording = () => {
		const { recordingActive, recording } = this.state
		const { sendAudio, user } = this.props

		recording
			.pauseAsync()
			.then((response) => {
				return recording.getURI()
			})
			.then((uri) => {
				const data = { uri, user }
				return sendAudio(data)
			})
			.then(() => {
				this.handleCloseAudioRecoding()
			})

			.catch((error) => {
				console.log(error)
				Audio.setAudioModeAsync({
					allowsRecordingIOS: false,
					interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
					playsInSilentModeIOS: true,
					shouldDuckAndroid: true,
					interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
					playThroughEarpieceAndroid: false,
					staysActiveInBackground: false,
				})
			})
	}
	render() {
		const { messages, recordAudioVisible } = this.state
		const { user, chat } = this.props
		return (
			<PageWrapper>
				<Drawer
					ref={(ref) => {
						this.drawer = ref
					}}
					onClose={this.closeDrawer}
					content={
						<Sidebar navigation={this.props.navigation} onClose={this.closeDrawer} />
					}
				>
					<Container>
						<Header>
							<Left>
								<Button transparent onPress={this.openDrawer}>
									<Icon type='Feather' name='menu' />
								</Button>
							</Left>
							<Body />
							<Right />
						</Header>

						<GiftedChat
							messages={chat}
							onSend={(messages) => this.onSend(messages)}
							user={{
								_id: firebase.auth().currentUser.uid,
								name: user && user.name,
								avatar: user && user.avatarURL,
							}}
							onLongPress={this.onLongPress}
							renderAccessory={this.renderAccessory}
							renderCustomView={this.renderCustomView}
							loadEarlier
							onLoadEarlier={() => {
								const { numberOfMessagesToLoad } = this.state
								const messagesToLoad = numberOfMessagesToLoad + 10
								this.props.startWatchingChat(messagesToLoad)
								this.setState({ numberOfMessagesToLoad: messagesToLoad })
							}}
						/>
					</Container>
				</Drawer>
				<Confirm
					visible={recordAudioVisible}
					title='Audio Recording'
					message='Audio is now recording...'
					leftOnPress={this.handleCloseAudioRecoding}
					leftButtonTitle='Cancel'
					rightOnPress={this.handleSendAudioReecording}
					rightButtonTitle='Send Recording'
				/>
			</PageWrapper>
		)
	}
}

const mapStateToProps = (state) => {
	const { user, chat } = state.User
	return { user, chat }
}

export default connect(mapStateToProps, {
	startWatchingUser,
	startWatchingChat,
	sendImage,
	sendAudio,
})(Main)
