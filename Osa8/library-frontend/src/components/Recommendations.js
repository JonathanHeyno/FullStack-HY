import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from './queries'


const Books = (props) => {
  const resultMe = useQuery(ME)
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (!result) {
    return null
  }
 
  if (result.loading || resultMe.loading)  {
    return <div>loading...</div>
  }

  const me = resultMe.data.me
  const allBooks = result.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>

      <div>books in your favorite genre {me.favoriteGenre}</div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {allBooks.filter((b) => b.genres.includes(me.favoriteGenre)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
