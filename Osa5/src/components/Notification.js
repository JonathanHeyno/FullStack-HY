import PropTypes from 'prop-types'

const Notification = ({ message, notificationClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={notificationClass}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  notificationClass: PropTypes.string
}

export default Notification