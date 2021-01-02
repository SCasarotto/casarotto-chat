import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Audio } from 'expo-av'

import { Container, Content, View, Text } from 'native-base'

import { startLoadingProcess } from './../../actions'

import PageWrapper from './../../components/PageWrapper'

import settings from './../../config/settings'
import styles from './styles'

class Loading extends Component {
	componentDidMount() {
		const { startLoadingProcess, navigation } = this.props
		startLoadingProcess(navigation)
		Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
			playThroughEarpieceAndroid: false,
			staysActiveInBackground: false,
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

export default connect(mapStateToProps, { startLoadingProcess })(Loading)
