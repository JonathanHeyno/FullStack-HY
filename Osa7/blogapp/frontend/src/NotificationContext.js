import { createContext, useReducer, useContext } from 'react'
import { Alert } from 'react-bootstrap'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  if (!action.message) {
    return
  }
  if (action.type === 'error') {
    return (<Alert variant="danger">{action.message}</Alert>)
  }
  return (<Alert variant="success">{action.message}</Alert>)
}


export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}


export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
