//import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'


// TOTEUTUS HOOKEILLA


// const NewAnecdote = (props) => {
//     const dispatch = useDispatch()
  
//     const addAnecdote = async (event) => {
//       event.preventDefault()
//       const content = event.target.anecdote.value
//       event.target.anecdote.value = ''
//       dispatch(createAnecdote(content))
//       dispatch(setNotification(`you created '${content}'`, 5))
//     }
  
//     return (
//     <form  onSubmit={addAnecdote}>
//       <h2>create new</h2>
//         <div><input name="anecdote" /></div>
//         <button type="submit">create</button>
//     </form>
//     )
//   }

//export default NewAnecdote



// TOTEUTUS CONNECTILLA


const NewAnecdote = (props) => {
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
    props.setNotification(`you created '${content}'`, 5)
  }

  return (
  <form  onSubmit={addAnecdote}>
    <h2>create new</h2>
      <div><input name="anecdote" /></div>
      <button type="submit">create</button>
  </form>
  )
}

const mapDispatchToProps = {  createAnecdote, setNotification}
const ConnectedNewAnecdote = connect(
  null,
  mapDispatchToProps)(NewAnecdote)

export default ConnectedNewAnecdote