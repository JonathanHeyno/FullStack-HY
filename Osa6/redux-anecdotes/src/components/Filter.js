//import { useDispatch } from 'react-redux'
import { changeFilter } from '../reducers/filterReducer'
import { connect } from 'react-redux'


// TOTEUTUS HOOKEILLA


// const Filter = () => {
//     const dispatch = useDispatch()

//     const handleChange = (event) => {
//       // input-kentän arvo muuttujassa event.target.value
//       dispatch(changeFilter(event.target.value))
//     }
//     const style = {
//       marginBottom: 10
//     }
  
//     return (
//       <div style={style}>
//         filter <input onChange={handleChange} />
//       </div>
//     )
//   }
  
//export default Filter



// TOTEUTUS CONNECTILLA

const Filter = (props) => {
  const handleChange = (event) => {
    props.changeFilter(event.target.value)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const mapDispatchToProps = {  changeFilter,}
const ConnectedFilter = connect(
  null,
  mapDispatchToProps)(Filter)

export default ConnectedFilter