import { useDispatch, useSelector } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div key={anecdote.id}>
      <div>
      {anecdote.content}
      </div>
      <div>
      has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter.filter)

  return(
    <div>
        {anecdotes
        .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => (b.votes ? b.votes : 0) - (a.votes ? a.votes : 0))
        .map(anecdote =>
        <Anecdote
        key={anecdote.id}
        anecdote={anecdote}
        handleClick={() => {
          dispatch(updateAnecdote(anecdote))
          dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
        }
        }
      />
      )}
    </div>
  )
}

export default Anecdotes