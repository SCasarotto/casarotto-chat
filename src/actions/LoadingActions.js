import { StackActions, NavigationActions } from 'react-navigation'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

import {
	SHOW_ALERT,
	HIDE_ALERT,
	SHOW_NETWORK_ACTIVITY,
	HIDE_NETWORK_ACTIVITY,
} from './../actions/types'

export const startLoadingProcess = (navigation) => {
	return (dispatch, getState) => {
		dispatch({
			type: SHOW_NETWORK_ACTIVITY,
			payload: 'Loading...',
		})

		let firstTimeCheck = true
		firebase.auth().onAuthStateChanged((user) => {
			if (firstTimeCheck) {
				firstTimeCheck = false
				if (user) {
					// console.log('User Found')
					//Check Account Complete
					const { uid } = firebase.auth().currentUser
					firebase
						.database()
						.ref(`Users/${uid}`)
						.once('value')
						.then((snapshot) => {
							console.log(snapshot.val())
							if (snapshot.val()) {
								const { name, avatarURL } = snapshot.val()
								if (name && avatarURL) {
									dispatch({ type: HIDE_NETWORK_ACTIVITY })
									navigation.dispatch(
										StackActions.reset({
											index: 0,
											actions: [
												NavigationActions.navigate({ routeName: 'Main' }),
											],
										})
									)
									return
								}
							}
							dispatch({ type: HIDE_NETWORK_ACTIVITY })
							navigation.dispatch(
								StackActions.reset({
									index: 0,
									actions: [NavigationActions.navigate({ routeName: 'Setup' })],
								})
							)
							return
						})
						.catch((error) => {
							console.log(error)
						})
				} else {
					// console.log('No User Found')
					firebase
						.auth()
						.signInAnonymously()
						.then((response) => {
							dispatch({ type: HIDE_NETWORK_ACTIVITY })
							navigation.dispatch(
								StackActions.reset({
									index: 0,
									actions: [NavigationActions.navigate({ routeName: 'Setup' })],
								})
							)
						})
						.catch(function(error) {
							console.log(error)
						})
				}
			}
		})
	}
}
