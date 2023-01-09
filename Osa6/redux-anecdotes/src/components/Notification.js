//import { useSelector } from 'react-redux'
import { connect } from 'react-redux'



// TOIMINTO HOOKEILLA


// const Notification = () => {
//   const notification = useSelector(state => state.notification.message)
//   const isVisible = useSelector(state => state.notification.isVisible)
//   let style = { display: 'none' }
//   if (isVisible) {
//     style = {
//       border: 'solid',
//       padding: 10,
//       borderWidth: 1
//     }
//   }
//   return (
//     <div style={style}>
//       {notification}
//     </div>
//   )
// }

//export default Notification




// TOIMINTO CONNECTILLA

const Notification = (props) => {
  let style = { display: 'none' }
  if (props.isVisible) {
    style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }
  }
  return (
    <div style={style}>
      {props.notification}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification.message,
    isVisible: state.notification.isVisible,
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification