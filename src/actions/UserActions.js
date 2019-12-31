import validate from 'validate.js'
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/auth'
import { StackActions, NavigationActions } from 'react-navigation'
import uuid from 'uuid'

import { SHOW_ALERT, SHOW_NETWORK_ACTIVITY, HIDE_NETWORK_ACTIVITY, UserKeys } from './types'
import { sentNotifications } from './../helpers'

export const startWatchingUser = () => {
	const { FETCH_USER, SAVE_USER_WATCHER } = UserKeys
	return (dispatch) => {
		const { uid } = firebase.auth().currentUser
		const userWatcherRef = firebase.database().ref(`Users/${uid}`)

		userWatcherRef.on(
			'value',
			(snapshot) => {
				dispatch({ type: FETCH_USER, payload: snapshot.val() })
			},
			(error) => console.log(error),
		)
		dispatch({ type: SAVE_USER_WATCHER, payload: userWatcherRef })
	}
}
export const stopWatchingUser = () => {
	const { REMOVE_USER_WATCHER } = UserKeys
	return (dispatch, getState) => {
		const { userWatcherRef } = getState().User
		if (userWatcherRef) {
			userWatcherRef.off()
			dispatch({ type: REMOVE_USER_WATCHER })
		}
	}
}

export const uploadImage = (uri) => {
	console.log(uri)
	return (dispatch) => {
		dispatch({
			type: SHOW_NETWORK_ACTIVITY,
			payload: 'Uploading Image...',
		})
		const { uid } = firebase.auth().currentUser
		new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.onload = function() {
				resolve(xhr.response)
			}
			xhr.onerror = function() {
				reject(new TypeError('Network request failed'))
			}
			xhr.responseType = 'blob'
			xhr.open('GET', uri, true)
			xhr.send(null)
		})
			.then((blob) => {
				const metadata = { contentType: 'image/jpg' }
				var upload = firebase
					.storage()
					.ref(`user/${uid}.jpg`)
					.put(blob, metadata)

				upload.on(
					firebase.storage.TaskEvent.STATE_CHANGED,
					(snapshot) => {
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
						)
						dispatch({
							type: SHOW_NETWORK_ACTIVITY,
							payload: `Uploading Image (${progress}%)...`,
						})
						switch (snapshot.state) {
							case firebase.storage.TaskState.PAUSED: // or 'paused'
								break
							case firebase.storage.TaskState.RUNNING: // or 'running'
								break
						}
					},
					(error) => {
						console.log(error)
						dispatch({
							type: SHOW_ALERT,
							payload: {
								alertTitle: 'Error',
								alertMessage: 'Error Uploading Avatar.',
							},
						})
					},
					() => {
						dispatch({ type: HIDE_NETWORK_ACTIVITY })
						upload.snapshot.ref
							.getDownloadURL()
							.then((downloadURL) => {
								return firebase
									.database()
									.ref(`Users/${uid}`)
									.update({ avatarURL: downloadURL })
							})
							.then(() => {
								dispatch({
									type: SHOW_ALERT,
									payload: {
										alertTitle: 'Success',
										alertMessage: 'Avatar Uploaded',
									},
								})
							})
							.catch((error) => {
								console.log(error)
								dispatch({
									type: SHOW_ALERT,
									payload: {
										alertTitle: 'Error',
										alertMessage: 'Error Uploading Avatar.',
									},
								})
							})
					},
				)
			})
			.catch((error) => {
				console.log(error)
			})
	}
}
export const setupUser = (data) => {
	const { name, user, navigation } = data

	if (!user || (user && !user.avatarURL)) {
		return (dispatch) => {
			dispatch({
				type: SHOW_ALERT,
				payload: {
					alertTitle: 'Error',
					alertMessage:
						'Please upload an avatar. We want to see your pretty face. This can be updated in the profile page later.',
				},
			})
		}
	}

	const validatorConstraints = {
		name: {
			presence: {
				allowEmpty: false,
			},
		},
	}
	const validationResponse = validate(data, validatorConstraints)
	if (validationResponse) {
		return (dispatch) => {
			dispatch({
				type: SHOW_ALERT,
				payload: {
					alertTitle: 'Error',
					alertMessage: Object.values(validationResponse)[0][0],
				},
			})
		}
	}
	return (dispatch) => {
		const { uid } = firebase.auth().currentUser
		firebase
			.database()
			.ref(`Users/${uid}`)
			.update({ name, lastSignIn: new Date().getTime() })
			.then(() => {
				dispatch({
					type: SHOW_ALERT,
					payload: {
						alertTitle: 'Success',
						alertMessage: 'Account Setup.',
					},
				})
				navigation.dispatch(
					StackActions.reset({
						index: 0,
						actions: [NavigationActions.navigate({ routeName: 'Main' })],
					}),
				)
			})
			.catch((error) => {
				console.log(error)
				dispatch({
					type: SHOW_ALERT,
					payload: {
						alertTitle: 'Error',
						alertMessage: 'Error Setting Up Account',
					},
				})
			})
	}
}
export const saveUser = (data) => {
	const { name, user } = data

	if (!user || (user && !user.avatarURL)) {
		return (dispatch) => {
			dispatch({
				type: SHOW_ALERT,
				payload: {
					alertTitle: 'Error',
					alertMessage: 'Please upload an avatar. We want to see your pretty face.',
				},
			})
		}
	}

	const validatorConstraints = {
		name: {
			presence: {
				allowEmpty: false,
			},
		},
	}
	const validationResponse = validate(data, validatorConstraints)
	if (validationResponse) {
		return (dispatch) => {
			dispatch({
				type: SHOW_ALERT,
				payload: {
					alertTitle: 'Error',
					alertMessage: Object.values(validationResponse)[0][0],
				},
			})
		}
	}
	return (dispatch) => {
		const { uid } = firebase.auth().currentUser
		firebase
			.database()
			.ref(`Users/${uid}`)
			.update({ name })
			.then(() => {
				dispatch({
					type: SHOW_ALERT,
					payload: {
						alertTitle: 'Success',
						alertMessage: 'Profile Saved.',
					},
				})
			})
			.catch((error) => {
				console.log(error)
				dispatch({
					type: SHOW_ALERT,
					payload: {
						alertTitle: 'Error',
						alertMessage: 'Error Saving Account',
					},
				})
			})
	}
}

export const startWatchingChat = (last = 2) => {
	return (dispatch) => {
		firebase
			.database()
			.ref('Chat')
			.orderByChild('createdAt')
			.limitToLast(last)
			.on(
				'value',
				(snapshot) => {
					dispatch({ type: UserKeys.FETCH_CHAT, payload: snapshot.val() })
				},
				(error) => console.log(error),
			)
	}
}

export const sendImage = (data) => {
	const { uri, user } = data

	return (dispatch) => {
		dispatch({
			type: SHOW_NETWORK_ACTIVITY,
			payload: 'Uploading Image...',
		})
		const { uid } = firebase.auth().currentUser
		new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.onload = function() {
				resolve(xhr.response)
			}
			xhr.onerror = function() {
				reject(new TypeError('Network request failed'))
			}
			xhr.responseType = 'blob'
			xhr.open('GET', uri, true)
			xhr.send(null)
		})
			.then((blob) => {
				const messageId = uuid.v4()
				const metadata = { contentType: 'image/jpg' }
				var upload = firebase
					.storage()
					.ref(`chat/${messageId}.jpg`)
					.put(blob, metadata)

				upload.on(
					firebase.storage.TaskEvent.STATE_CHANGED,
					(snapshot) => {
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
						)
						dispatch({
							type: SHOW_NETWORK_ACTIVITY,
							payload: `Uploading Image (${progress}%)...`,
						})
						switch (snapshot.state) {
							case firebase.storage.TaskState.PAUSED: // or 'paused'
								break
							case firebase.storage.TaskState.RUNNING: // or 'running'
								break
						}
					},
					(error) => {
						console.log(error)
						dispatch({
							type: SHOW_ALERT,
							payload: {
								alertTitle: 'Error',
								alertMessage: 'Error Uploading Image.',
							},
						})
					},
					() => {
						dispatch({ type: HIDE_NETWORK_ACTIVITY })
						upload.snapshot.ref
							.getDownloadURL()
							.then((downloadURL) => {
								const { name, avatarURL } = user
								return firebase
									.database()
									.ref('Chat')
									.push({
										image: downloadURL,
										_id: messageId,
										createdAt: firebase.database.ServerValue.TIMESTAMP,
										user: { _id: uid, name: name, avatar: avatarURL },
									})
							})
							.then(() => {
								sentNotifications({ user, type: 'image' })
							})
							.catch((error) => {
								console.log(error)
								dispatch({
									type: SHOW_ALERT,
									payload: {
										alertTitle: 'Error',
										alertMessage: 'Error Sending Image.',
									},
								})
							})
					},
				)
			})
			.catch((error) => {
				console.log(error)
			})
	}
}

export const sendAudio = (data) => {
	const { uri, user } = data

	return (dispatch) => {
		new Promise((res, rej) => {
			dispatch({
				type: SHOW_NETWORK_ACTIVITY,
				payload: 'Uploading Image...',
			})
			const { uid } = firebase.auth().currentUser
			new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest()
				xhr.onload = function() {
					resolve(xhr.response)
				}
				xhr.onerror = function() {
					reject(new TypeError('Network request failed'))
				}
				xhr.responseType = 'blob'
				xhr.open('GET', uri, true)
				xhr.send(null)
			})
				.then((blob) => {
					const messageId = uuid.v4()
					const fileExtension = uri.split('.')[uri.split('.').length - 1]

					const metadata = { contentType: `audio/${fileExtension}` }
					var upload = firebase
						.storage()
						.ref(`chat/${messageId}.${fileExtension}`)
						.put(blob, metadata)

					upload.on(
						firebase.storage.TaskEvent.STATE_CHANGED,
						(snapshot) => {
							// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
							const progress = Math.round(
								(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
							)
							dispatch({
								type: SHOW_NETWORK_ACTIVITY,
								payload: `Uploading Audio File (${progress}%)...`,
							})
							switch (snapshot.state) {
								case firebase.storage.TaskState.PAUSED: // or 'paused'
									break
								case firebase.storage.TaskState.RUNNING: // or 'running'
									break
							}
						},
						(error) => {
							console.log(error)
							dispatch({
								type: SHOW_ALERT,
								payload: {
									alertTitle: 'Error',
									alertMessage: 'Error Uploading Audio File.',
								},
							})
							return rej()
						},
						() => {
							dispatch({ type: HIDE_NETWORK_ACTIVITY })
							upload.snapshot.ref
								.getDownloadURL()
								.then((downloadURL) => {
									const { name, avatarURL } = user
									return firebase
										.database()
										.ref('Chat')
										.push({
											audio: downloadURL,
											_id: messageId,
											createdAt: firebase.database.ServerValue.TIMESTAMP,
											user: { _id: uid, name: name, avatar: avatarURL },
										})
								})
								.then(() => {
									sentNotifications({ user, type: 'audio' })
									return res()
								})
								.catch((error) => {
									console.log(error)
									dispatch({
										type: SHOW_ALERT,
										payload: {
											alertTitle: 'Error',
											alertMessage: 'Error Sending Audio.',
										},
									})
									return rej()
								})
						},
					)
				})
				.catch((error) => {
					console.log(error)
					return rej()
				})
		})
	}
}
