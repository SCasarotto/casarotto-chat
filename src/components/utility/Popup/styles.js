import { Platform, StyleSheet } from 'react-native'

export default StyleSheet.create({
	background: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
		padding: 10,
		zIndex: 10,
	},
	absolute: {
		position: 'absolute',
	},
	container: {
		position: 'absolute',
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 5,
		shadowColor: 'rgba(0,0,0,0.5)',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 5,
		alignSelf: 'center',
		maxWidth: '100%',
	},
})
