import { StackActions, NavigationActions } from 'react-navigation'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import settings from './../config/settings'

import { SHOW_NETWORK_ACTIVITY, HIDE_NETWORK_ACTIVITY } from './../actions/types'

export const startLoadingProcess = (navigation) => {
	return (dispatch) => {
		dispatch({
			type: SHOW_NETWORK_ACTIVITY,
			payload: 'Loading...',
		})

		let firstTimeCheck = true
		firebase.auth().onAuthStateChanged(async (user) => {
			if (firstTimeCheck) {
				firstTimeCheck = false
				if (user) {
					//Check Account Complete
					try {
						const { uid } = firebase.auth().currentUser
						const snapshot = await firebase
							.database()
							.ref(`Users/${uid}`)
							.once('value')
						const userModel = snapshot.val()

						firebase
							.database()
							.ref(`Users/${uid}`)
							.update({
								lastSignIn: new Date().getTime(),
								version: settings.VERSION,
							})
						if (userModel && userModel.name && userModel.avatarURL) {
							dispatch({ type: HIDE_NETWORK_ACTIVITY })
							navigation.dispatch(
								StackActions.reset({
									index: 0,
									actions: [NavigationActions.navigate({ routeName: 'Main' })],
								}),
							)
							return
						}
						dispatch({ type: HIDE_NETWORK_ACTIVITY })
						navigation.dispatch(
							StackActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: 'Setup' })],
							}),
						)
						return
					} catch (e) {
						console.log(e)
						return
					}
				} else {
					try {
						await firebase.auth().signInAnonymously()
						dispatch({ type: HIDE_NETWORK_ACTIVITY })
						navigation.dispatch(
							StackActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: 'Setup' })],
							}),
						)
						return
					} catch (e) {
						console.log(e)
					}
				}
			}
		})
	}
}
