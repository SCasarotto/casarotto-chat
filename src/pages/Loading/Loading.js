import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase/app'
import { Audio, Constants, Permissions, Notifications } from 'expo'

import { Container, Content, Header, Footer, View, Text } from 'native-base'

import { startLoadingProcess } from './../../actions'

import PageWrapper from './../../components/PageWrapper'

import settings from './../../config/settings'
import styles from './styles'

class Loading extends Component {
	componentDidMount() {
		const {
			FIREBASE_API_KEY,
			FIREBASE_AUTH_DOMAIN,
			FIREBASE_DATABASE_URL,
			FIREBASE_PROJECT_ID,
			FIREBASE_STORAGE_BUCKET,
			FIREBASE_MESSAGING_SENDER_ID,
		} = settings

		firebase.initializeApp({
			apiKey: FIREBASE_API_KEY,
			authDomain: FIREBASE_AUTH_DOMAIN,
			databaseURL: FIREBASE_DATABASE_URL,
			projectId: FIREBASE_PROJECT_ID,
			storageBucket: FIREBASE_STORAGE_BUCKET,
			messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
		})

		const { startLoadingProcess, navigation } = this.props
		startLoadingProcess(navigation)
		Audio.setAudioModeAsync({
			allowsRecordingIOS: true,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
			playThroughEarpieceAndroid: true,
		})
			.then((response) => {
				// console.log('Audio Mode Setup')
			})
			.catch((error) => console.log(error))
	}

	render() {
		return (
			<PageWrapper>
				<Container>
					<Content contentContainerStyle={{ flexGrow: 1 }}>
						<View style={styles.loadingWrapper}>
							<Text>Loading...</Text>
							<Text>Version: {settings.VERSION}</Text>
						</View>
					</Content>
				</Container>
			</PageWrapper>
		)
	}
}

const mapStateToProps = (state) => {
	return {}
}

export default connect(
	mapStateToProps,
	{ startLoadingProcess }
)(Loading)
