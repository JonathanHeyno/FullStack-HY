const Notification = ({ message, isErrorMessage }) => {
  if (! message) {
    const emptyStyle = {
      height: 57.3,
    }
    return (
      <div style={emptyStyle}>
        {message}
      </div>
    )
  }

  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={isErrorMessage ? errorStyle : notificationStyle}>
      {message}
    </div>
  )
}

  export default Notification