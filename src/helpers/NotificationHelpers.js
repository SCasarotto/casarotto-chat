import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import axios from 'axios'

export const sentNotifications = async ({ user, type, message }) => {
	const { name, debug } = user
	let body = `${name} `
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
	try {
		const usersSnapshot = await firebase
			.database()
			.ref('Users')
			.once('value')
		const users = usersSnapshot.val()
		if (users) {
			const data = []
			const thisUserUID = firebase.auth().currentUser.uid
			for (const uid in users) {
				if (uid !== thisUserUID) {
					const otherUser = users[uid]
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
			if (debug) {
				alert(JSON.stringify(data))
			}
			const pushResponse = await axios({
				method: 'POST',
				url: 'https://exp.host/--/api/v2/push/send',
				headers: {
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json',
				},
				data,
			})
			if (debug) {
				console.log('push response', pushResponse)
				alert(JSON.stringify(pushResponse))
			}
		}
	} catch (e) {
		console.log(e)
		if (debug) {
			alert(e)
			alert(JSON.stringify(e))
		}
	}
}
