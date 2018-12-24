import { UserKeys } from './../actions/types'

const INITIAL_STATE = {
	user: undefined,
	userLoaded: false,
	userWatcherRef: undefined,

	chat: [],
}

export default (state = INITIAL_STATE, action) => {
	const { FETCH_USER, SAVE_USER_WATCHER, REMOVE_USER_WATCHER, FETCH_CHAT } = UserKeys

	switch (action.type) {
		case FETCH_USER:
			return { ...state, user: action.payload, userLoaded: true }
		case SAVE_USER_WATCHER:
			return { ...state, userWatcherRef: action.payload }
		case REMOVE_USER_WATCHER:
			return {
				...state,
				user: INITIAL_STATE.user,
				userLoaded: INITIAL_STATE.userLoaded,
				userWatcherRef: INITIAL_STATE.userWatcherRef,
			}

		case FETCH_CHAT: {
			if (!action.payload) {
				return { ...state, chat: INITIAL_STATE.chat }
			}

			let chat = Object.values(action.payload).sort((a, b) => b.createdAt - a.createdAt)

			return { ...state, chat }
		}

		default:
			return state
	}
}
