import { StyleSheet } from 'react-native'
import { colors } from './../../config/styles'

export default StyleSheet.create({
	actionRow: {
		flexDirection: 'row',
		alignItems: 'stretch',
		flexWrap: 'nowrap',
	},
	actionButton: { flex: 1, borderRadius: 0 },
	actionButtonText: {
		fontSize: 14,
	},
	playPauseButton: {},
	playPauseIcon: (right) => ({
		color: right ? colors.white : colors.black,
		fontSize: 30,
	}),
})
