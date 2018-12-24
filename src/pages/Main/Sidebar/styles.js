import { StyleSheet } from 'react-native'
import { colors } from './../../../config/styles'

export default StyleSheet.create({
	header: {
		paddingTop: 30,
		paddingBottom: 20,
		paddingLeft: 15,
	},
	headerText: {
		fontSize: 30,
		color: colors.primary,
		marginLeft: 5,
		marginBottom: 5,
	},
	versionText: {
		fontSize: 14,
		textAlign: 'left',
		color: colors.gray,
		marginLeft: 5,
	},
	itemIcon: {
		fontSize: 30,
		color: colors.secondary,
	},
	itemText: {
		marginLeft: 10,
		fontSize: 20,
		color: colors.secondary,
	},
})
