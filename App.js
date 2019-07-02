import React, { Component } from 'react'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'

import { StyleProvider, Root } from 'native-base'
import getTheme from './native-base-theme/components'
import platform from './native-base-theme/variables/platform'

import reducers from './src/reducers'

import Loading from './src/pages/Loading'
import Setup from './src/pages/Setup'
import Main from './src/pages/Main'
import Profile from './src/pages/Profile'

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
	}
)
const App = createAppContainer(RootStack)

class RootComponent extends Component {
	state = { loading: true }
	async componentWillMount() {
		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
		})
		this.setState({ loading: false })
	}
	render() {
		if (this.state.loading) {
			//TODO: Consider using this to do my loading flow....
			return <AppLoading />
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
