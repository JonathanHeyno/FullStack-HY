import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from './queries'
import Select from 'react-select';


const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors.map(a => ({...a, label: a.name, value: a.name}))

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({  variables: { name: selectedAuthor.name, setBornTo: parseInt(born) } })

    setSelectedAuthor(null)
    setBorn('')
  }


  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birth year</h3>
      <form onSubmit={submit}>
        <Select
          defaultValue={selectedAuthor}
          onChange={setSelectedAuthor}
          options={authors}
        />
        <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
