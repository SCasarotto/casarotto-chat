import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

import { Image } from 'react-native'
import {
	Container,
	Header,
	Content,
	Form,
	View,
	Item,
	Icon,
	Label,
	Input,
	Text,
	Button,
} from 'native-base'

import { startWatchingUser, uploadImage, setupUser } from './../../actions'

import PageWrapper from './../../components/PageWrapper'

import { defaultAvatar } from './../../config/images'
import styles from './styles'

class Setup extends Component {
	state = {
		name: '',
	}
	componentDidMount() {
		this.props.startWatchingUser()
	}

	handleUploadImage = () => {
		Permissions.askAsync(Permissions.CAMERA_ROLL)
			.then((response) => {
				const { status, expires, permissions } = response
				if (status === 'granted') {
					ImagePicker.launchImageLibraryAsync({
						allowsEditing: true,
						aspect: [1, 1],
						quality: 0.5,
					})
						.then((response) => {
							console.log(response)
							if (!response.cancelled) {
								this.props.uploadImage(response.uri)
							}
						})
						.catch((error) => console.log(error))
				}
			})
			.catch((error) => console.log(error))
	}
	handleTakeImage = () => {
		Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA)
			.then((response) => {
				const { status, expires, permissions } = response
				if (status === 'granted') {
					ImagePicker.launchCameraAsync({
						allowsEditing: true,
						aspect: [1, 1],
						base64: true,
						quality: 0.5,
					})
						.then((response) => {
							if (!response.cancelled) {
								this.props.uploadImage(response.uri)
							}
						})
						.catch((error) => console.log(error))
				}
			})
			.catch((error) => console.log(error))
	}
	handleSetupUser = () => {
		const { name } = this.state
		const { setupUser, user, navigation } = this.props

		const data = { name, user, navigation }

		setupUser(data)
	}

	render() {
		const { name } = this.state
		const { user } = this.props

		return (
			<PageWrapper>
				<Container>
					<Header />
					<Content>
						<Form style={styles.form}>
							<Text style={styles.title}>Account Setup</Text>
							<View style={styles.imageUploadItem}>
								{user && user.avatarURL ? (
									<Image
										style={styles.userPhoto}
										source={{ uri: user.avatarURL }}
									/>
								) : (
									<Image style={styles.userPhoto} source={defaultAvatar} />
								)}
								<View style={styles.imageUploadButtonWrapper}>
									<Button
										block
										primary
										style={styles.imageUploadButton}
										onPress={this.handleTakeImage}
									>
										<Icon type='Entypo' name='camera' />
									</Button>
									<Button
										block
										primary
										style={styles.imageUploadButton}
										onPress={this.handleUploadImage}
									>
										<Icon type='Entypo' name='upload' />
									</Button>
								</View>
							</View>
							<Item stackedLabel style={styles.inputWrapper}>
								<Label>Name</Label>
								<Input
									value={name}
									onChangeText={(name) => this.setState({ name })}
									autoCapitalize='none'
									autoCorrect={false}
									autoFocus={true}
									autoCapitalize='words'
								/>
							</Item>
							<Button
								block
								primary
								style={styles.submitButton}
								onPress={this.handleSetupUser}
							>
								<Text>Save</Text>
							</Button>
						</Form>
					</Content>
				</Container>
			</PageWrapper>
		)
	}
}

const mapStateToProps = (state) => {
	const { user } = state.User
	return { user }
}

export default connect(mapStateToProps, { startWatchingUser, uploadImage, setupUser })(Setup)
