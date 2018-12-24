import {
	SHOW_ALERT,
	HIDE_ALERT,
	SHOW_CONFIRM,
	HIDE_CONFIRM,
	SHOW_NETWORK_ACTIVITY,
	HIDE_NETWORK_ACTIVITY,
} from './../actions/types'

const INITIAL_STATE = {
	alertIsVisible: false,
	alertTitle: '',
	alertMessage: '',

	confirmTitle: '',
	confirmMessage: '',
	confirmIsVisible: false,
	confirmLeftTitle: 'Cancel',
	confirmRightOnClick: () => {},
	confirmRightTitle: '',

	networkActivityIsVisible: false,
	networkMessage: '',
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SHOW_ALERT:
			return { ...state, alertIsVisible: true, ...action.payload }
		case HIDE_ALERT:
			return { ...state, alertIsVisible: false }
		case SHOW_CONFIRM:
			return { ...state, confirmIsVisible: true, ...action.payload }
		case HIDE_CONFIRM:
			return { ...state, confirmIsVisible: false }
		case SHOW_NETWORK_ACTIVITY:
			return { ...state, networkActivityIsVisible: true, networkMessage: action.payload }
		case HIDE_NETWORK_ACTIVITY:
			return { ...state, networkActivityIsVisible: false }

		default:
			return state
	}
}
