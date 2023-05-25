import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  return notification
}

export default Notification
