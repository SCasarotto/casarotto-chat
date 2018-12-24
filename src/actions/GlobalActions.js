import {
	SHOW_ALERT,
	HIDE_ALERT,
	SHOW_CONFIRM,
	HIDE_CONFIRM,
	SHOW_NETWORK_ACTIVITY,
	HIDE_NETWORK_ACTIVITY,
} from './../actions/types'

export const showAlert = (alertTitle, alertMessage) => ({
	type: SHOW_ALERT,
	payload: { alertTitle, alertMessage },
})
export const hideAlert = () => ({ type: HIDE_ALERT })

export const showConfirm = (
	confirmTitle,
	confirmMessage,
	confirmLeftTitle,
	confirmRightOnClick,
	confirmRightTitle
) => ({
	type: SHOW_CONFIRM,
	payload: {
		confirmTitle,
		confirmMessage,
		confirmLeftTitle,
		confirmRightOnClick,
		confirmRightTitle,
	},
})
export const hideConfirm = () => ({ type: HIDE_CONFIRM })

export const showNetworkActivity = (networkMessage) => ({
	type: SHOW_NETWORK_ACTIVITY,
	payload: { networkMessage },
})
export const hideNetworkActivity = () => ({ type: HIDE_NETWORK_ACTIVITY })
