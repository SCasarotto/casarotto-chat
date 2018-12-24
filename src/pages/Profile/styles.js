import { StyleSheet } from 'react-native'
import { colors } from './../../config/styles'

export default StyleSheet.create({
	form: {
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 15,
	},
	title: {
		fontSize: 42,
		textAlign: 'center',
		marginTop: 15,
		marginBottom: 15,
		fontWeight: '500',
		color: colors.primary,
	},
	imageUploadItem: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 0,
		paddingTop: 30,
		paddingBottom: 30,
	},
	userPhoto: {
		width: 100,
		height: 100,
		marginRight: 30,
		borderRadius: 50,
	},
	imageUploadButton: {
		marginBottom: 5,
	},
	inputWrapper: {
		marginLeft: 0,
	},
	submitButton: {
		marginTop: 20,
	},
	formFooter: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 5,
	},
	formFooterButton: {},
	formFooterButtonText: {
		fontSize: 14,
	},
})
