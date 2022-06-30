import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const [votes, setVote] = useState(new Uint8Array(anecdotes.length))
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))
  const [most, setMostVotes] = useState(selected)

  const handleNextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVote(copy)
    if (votes[selected] >= votes[most]) {
      setMostVotes(selected)
    }
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={() => handleVote()} text="vote" />
      <Button handleClick={() => handleNextAnecdote()} text="next anecdote" />
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[most]}</p>
      <p>has {votes[most]} votes</p>
    </div>
  )
}

export default App