import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      state = action.payload
      return state
    },
    hideNotification(state) {
      state = null
      return state
    }
  }
})

export const setNotification = (message, time=3, type='success') => {
  const notification = {
    message: message,
    type: type,
  }
  return (dispatch) => {
    dispatch(showNotification(notification))
    clearTimeout()
    setTimeout(() => dispatch(hideNotification()), time*1000)
  }
}

export const { hideNotification, showNotification } = notificationSlice.actions
export default notificationSlice.reducer