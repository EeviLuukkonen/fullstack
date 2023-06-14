import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      state = action.payload
      return state
    }
  }
})

export const loginUser = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username, password,
      })
      dispatch(setUser(user))
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setNotification(`logged in with ${user.name}`, 2, 'success'))
    } catch (error) {
      dispatch(setNotification('wrong credentials', 2, 'error'))
    }
  }
}

export const logoutUser = () => {
  return async dispatch => {
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedUser')
  }
}

export const initializeUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }
}

export const { setUser } = userSlice.actions

export default userSlice.reducer