import React, { Component } from 'react'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import firebase from 'firebase/app'

import { StyleProvider, Root } from 'native-base'
import getTheme from './native-base-theme/components'
import platform from './native-base-theme/variables/platform'

import reducers from './src/reducers'
import settings from './src/config/settings'

import Loading from './src/pages/Loading'
import Setup from './src/pages/Setup'
import Main from './src/pages/Main'
import Profile from './src/pages/Profile'

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

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

const RootStack = createStackNavigator(
	{
		Loading,
		Setup,
		Main,
		Profile,
	},
	{
		initialRouteName: 'Loading',
		defaultNavigationOptions: {
			header: null,
		},
	},
)
const App = createAppContainer(RootStack)

class RootComponent extends Component {
	state = { loading: true }
	render() {
		if (this.state.loading) {
			return (
				<AppLoading
					startAsync={async () => {
						await Font.loadAsync({
							Roboto: require('native-base/Fonts/Roboto.ttf'),
							Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
						})
					}}
					onFinish={() => this.setState({ loading: false })}
					onError={console.warn}
				/>
			)
		}
		return (
			<Root>
				<StyleProvider style={getTheme(platform)}>
					<Provider store={store}>
						<App />
					</Provider>
				</StyleProvider>
			</Root>
		)
	}
}

export default RootComponent
