import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "vote":
      state = `You voted ${action.content}`
      return state
    case "create":
      state = `You created ${action.content}`
      return state
    case "clear":
      state = ''
      return state
    case "error":
      state = "Too short anecdote, must have length 5 or more"
      return state
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')  
    return (
      <NotificationContext.Provider value={[notification, notificationDispatch]}>
        {props.children}
      </NotificationContext.Provider>
    )
}

export default NotificationContext