import { StyleSheet } from 'react-native'
import { colors } from './../../config/styles'

export default StyleSheet.create({
	actionRow: {
		flexDirection: 'row',
		alignItems: 'stretch',
		flexWrap: 'nowrap',
	},
	actionButton: (color) => ({
		flex: 1,
		borderRadius: 0,
		backgroundColor: color,
	}),
	actionButtonText: {
		fontSize: 14,
	},
	playPauseButton: {},
	playPauseIcon: (right) => ({
		color: right ? colors.white : colors.black,
		fontSize: 30,
	}),
})
