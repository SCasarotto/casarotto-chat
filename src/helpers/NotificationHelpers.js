import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import axios from 'axios'

export const sentNotifications = ({ user, type, message }) => {
	let body = `${user.name} `
	switch (type) {
		case 'message':
			body += `- ${message}`
			break
		case 'image':
			body += 'has sent a picture.'
			break
		case 'audio':
			body += 'has sent an audio file'
			break
		default:
			body += 'has sent a message'
			break
	}

	firebase
		.database()
		.ref('Users')
		.once('value')
		.then((snapshot) => {
			if (snapshot.val()) {
				const data = []
				const thisUserUID = firebase.auth().currentUser.uid
				for (const uid in snapshot.val()) {
					if (uid !== thisUserUID) {
						const otherUser = snapshot.val()[uid]
						if (otherUser.exponentPushToken) {
							data.push({
								to: otherUser.exponentPushToken,
								sound: 'default',
								body,
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
					.then((response) => {
						// console.log('push response', response)
					})
					.catch((error) => console.log(error))
			}
		})
}
