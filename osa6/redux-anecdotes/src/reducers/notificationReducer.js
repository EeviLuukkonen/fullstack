import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      state = action.payload
      return state
    },
    hideNotification(state, action) {
      state = null
      return state
    }
  }
})

export const setNotification = (notification, time) => {
  return (dispatch) => {
    dispatch(showNotification(notification))
    clearTimeout()
    setTimeout(() => dispatch(hideNotification()), time)
  }
}

export const { hideNotification, showNotification } = notificationSlice.actions
export default notificationSlice.reducer
