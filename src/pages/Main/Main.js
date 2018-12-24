import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Speech, Permissions, ImagePicker, Audio, Constants, Notifications } from 'expo'
import axios from 'axios'

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
import { Platform, AsyncStorage, Clipboard, AppState } from 'react-native'

import { startWatchingUser, startWatchingChat, sendImage, sendAudio } from './../../actions'

import PageWrapper from './../../components/PageWrapper'
import Confirm from './../../components/Popup/Confirm'

import Sidebar from './Sidebar'
import AudioCustom from './AudioCustom'

import settings from './../../config/settings'
import { colors } from './../../config/styles'
import styles from './styles'

class Main extends Component {
	state = {
		numberOfMessagesToLoad: 15,
		recording: undefined,
		recordingActive: false,
		recordAudioVisible: false,
		playingRecording: '',
	}
	componentDidMount() {
		const { numberOfMessagesToLoad } = this.state
		const { startWatchingUser, startWatchingChat } = this.props
		startWatchingUser()
		startWatchingChat(numberOfMessagesToLoad)

		if (Constants.isDevice) {
			//Only Run On Devices. Will Crash in emulators
			Permissions.getAsync(Permissions.NOTIFICATIONS)
				.then((response) => {
					switch (response.status) {
						case 'granted':
							Notifications.getExpoPushTokenAsync()
								.then((response) => {
									console.log('TOKEN!!!', response)
									const { uid } = firebase.auth().currentUser
									firebase
										.database()
										.ref(`/Users/${uid}`)
										.update({
											exponentPushToken: response,
										})
								})
								.catch((error) => console.log(error))
							break
						case 'undetermined':
						case 'denied':
							Permissions.askAsync(Permissions.NOTIFICATIONS)
								.then((response) => {
									console.log('IN HERE')
									if (response.status !== 'granted') {
										return
									}

									Notifications.getExpoPushTokenAsync()
										.then((response) => {
											const { uid } = firebase.auth().currentUser
											firebase
												.database()
												.ref(`/Users/${uid}`)
												.update({
													exponentPushToken: response,
												})
										})
										.catch((error) => console.log(error))
								})
								.catch((error) => console.log(error))
						default:
							break
					}
				})
				.catch((error) => console.log(error))
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
				firebase
					.database()
					.ref('Users')
					.once('value')
					.then((snapshot) => {
						if (snapshot.val()) {
							const data = []
							const thisUserUID = firebase.auth().currentUser.uid
							console.log(thisUserUID)
							for (const uid in snapshot.val()) {
								if (uid !== thisUserUID) {
									const otherUser = snapshot.val()[uid]
									if (otherUser.exponentPushToken) {
										data.push({
											to: otherUser.exponentPushToken,
											sound: 'default',
											body: `${user.name} - ${messages[0].text}.`,
											badge: 1,
										})
									}
								}
							}
							axios({
								method: 'POST',
								url: 'https://exp.host/--/api/v2/push/send',
								headers: {
									accept: 'application/json',
									'accept-encoding': 'gzip, deflate',
									'content-type': 'application/json',
								},
								data,
							})
								.then((response) => console.log('push response', response))
								.catch((error) => console.log(error))
						}
					})
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
				}
			)
		}
	}
	renderAccessory = () => (
		<View style={styles.actionRow}>
			<Button block style={styles.actionButton} onPress={this.handleTakeImage}>
				<Icon type="Entypo" name="camera" />
			</Button>
			<Button block style={styles.actionButton} onPress={this.handleUploadImage}>
				<Icon type="Entypo" name="upload" />
			</Button>
			<Button block style={styles.actionButton} onPress={this.handleStartAudioRecording}>
				<Icon type="MaterialIcons" name="keyboard-voice" />
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
				console.log('Permission Response', response)
				if (status === 'granted') {
					ImagePicker.launchImageLibraryAsync({
						allowsEditing: true,
						aspect: [1, 1],
						base64: true,
						quality: 0.7,
					})
						.then((response) => {
							console.log(response)
							if (!response.cancelled) {
								const { user, sendImage } = this.props
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
				console.log('Permission Response', response)
				if (status === 'granted') {
					ImagePicker.launchCameraAsync({
						allowsEditing: true,
						aspect: [1, 1],
						base64: true,
						quality: 0.7,
					})
						.then((response) => {
							console.log(response)
							if (!response.cancelled) {
								const { user, sendImage } = this.props
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
		Permissions.askAsync(Permissions.AUDIO_RECORDING)
			.then((response) => {
				const { status, expires, permissions } = response
				console.log('Permission Response', response)
				if (status === 'granted') {
					const newRecording = new Audio.Recording()
					newRecording
						.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
						.then((response) => {
							console.log('prepareToRecordAsync:', response)
							return newRecording.startAsync()
						})
						.then((response) => {
							console.log('startAsync', response)
							this.setState({
								recordingActive: true,
								recording: newRecording,
								recordAudioVisible: true,
							})
						})
						.catch((error) => console.log(error))
				}
			})
			.catch((error) => console.log(error))
	}
	handleCloseAudioRecoding = () => {
		const { recordingActive, recording } = this.state

		console.log('Stop and Close Recording')
		recording
			.stopAndUnloadAsync()
			.then((response) => {
				console.log('stopAndUnloadAsync', response)
				this.setState({
					recordingActive: false,
					recording: undefined,
					recordAudioVisible: false,
				})
			})
			.catch((error) => console.log(error))
	}
	handleSendAudioReecording = () => {
		const { recordingActive, recording } = this.state
		const { sendAudio, user } = this.props

		console.log('Stop Recording')
		recording
			.pauseAsync()
			.then((response) => {
				console.log('pauseAsync', response)
				return recording.getURI()
			})
			.then((uri) => {
				console.log('getURI', uri)
				const data = { uri, user }
				return sendAudio(data)
			})
			.then(() => {
				this.handleCloseAudioRecoding()
			})

			.catch((error) => console.log(error))
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
									<Icon type="Feather" name="menu" />
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
								console.log('loadEarlier')
								this.props.startWatchingChat(messagesToLoad)
								this.setState({ numberOfMessagesToLoad: messagesToLoad })
							}}
						/>
					</Container>
				</Drawer>
				<Confirm
					visible={recordAudioVisible}
					title="Audio Recording"
					message="Audio is now recording..."
					leftOnPress={this.handleCloseAudioRecoding}
					leftButtonTitle="Cancel"
					rightOnPress={this.handleSendAudioReecording}
					rightButtonTitle="Send Recording"
				/>
			</PageWrapper>
		)
	}
}

const mapStateToProps = (state) => {
	const { user, chat } = state.User
	return { user, chat }
}

export default connect(
	mapStateToProps,
	{ startWatchingUser, startWatchingChat, sendImage, sendAudio }
)(Main)
