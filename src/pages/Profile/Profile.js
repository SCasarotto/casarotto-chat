import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

import { Image } from 'react-native'
import {
	Container,
	Header,
	Left,
	Body,
	Right,
	Icon,
	Title,
	Content,
	Form,
	View,
	Item,
	Label,
	Input,
	Text,
	Button,
} from 'native-base'

import { uploadImage, saveUser } from './../../actions'

import PageWrapper from './../../components/PageWrapper'

import { defaultAvatar } from './../../config/images'
import styles from './styles'

class Profile extends Component {
	state = {
		name: '',
	}

	static getDerivedStateFromProps(newProps, oldState) {
		const { user } = newProps

		if (user && user !== oldState.user) {
			const { name = '' } = user
			return { user, name }
		}
		return { user }
	}

	handleUploadImage = () => {
		Permissions.askAsync(Permissions.CAMERA_ROLL)
			.then((response) => {
				const { status } = response
				console.log('Permission Response', response)
				if (status === 'granted') {
					ImagePicker.launchImageLibraryAsync({
						allowsEditing: true,
						aspect: [1, 1],
						base64: true,
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
				const { status } = response
				console.log('Permission Response', response)
				if (status === 'granted') {
					ImagePicker.launchCameraAsync({
						allowsEditing: true,
						aspect: [1, 1],
						base64: true,
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
	handleSetupUser = () => {
		const { name } = this.state
		const { saveUser, user, navigation } = this.props

		const data = { name, user, navigation }

		saveUser(data)
	}
	handleBack = () => {
		this.props.navigation.goBack()
	}

	render() {
		const { name } = this.state
		const { user } = this.props

		return (
			<PageWrapper>
				<Container>
					<Header>
						<Left>
							<Button transparent onPress={this.handleBack}>
								<Icon type='Ionicons' name='ios-arrow-back' />
							</Button>
						</Left>
						<Body>
							<Title>Profile</Title>
						</Body>
						<Right />
					</Header>
					<Content>
						<Form style={styles.form}>
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

export default connect(
	mapStateToProps,
	{ uploadImage, saveUser }
)(Profile)
