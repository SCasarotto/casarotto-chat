import { combineReducers } from 'redux'

import Global from './GlobalReducer'
import Loading from './LoadingReducer'
import User from './UserReducer'

export default combineReducers({
	Global,
	Loading,
	User,
})
