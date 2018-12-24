import { Platform, StyleSheet } from 'react-native'
import { colors } from './../../../config/styles'

export default StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        zIndex: 100,
    },
    container: {
        position: 'absolute',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 5,
        elevation: 2,
        alignSelf: 'center',
        width: 100,
        height: 100,
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        color: colors.secondary,
    },
})
