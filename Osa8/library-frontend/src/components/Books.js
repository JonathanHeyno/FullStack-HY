import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GENRE_BOOKS } from './queries'

const Genres = ({books, handleClick}) => {
  const genres = new Set([]);
  books.forEach( book => book.genres.forEach(genre => genres.add(genre)))
  return (
    <div>
      <div>
        {[...genres].filter(a => a.length!==0).map((genre) => (<button key={genre} onClick={() => handleClick({genre})}>{genre}</button>))}
        <button onClick={() => handleClick({genre: ""})}>all genres</button>
      </div>
    </div>
  )
}


const Books = (props) => {
  const [genre, setGenre] = useState("")
  const result = useQuery(ALL_BOOKS)
  const resultWithGenres = useQuery(GENRE_BOOKS, { variables: { genre },})

  if (!props.show) {
    return null
  }

  if (result.loading || resultWithGenres.loading)  {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const booksToShow = resultWithGenres.data.allBooks

  const handleClick = (value) => {
    setGenre(value.genre)
  }

  if (genre === "") {
    return (
      <div>
        <h2>books</h2>
  
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Genres books={books} handleClick={handleClick} />
      </div>
    )
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Genres books={books} handleClick={handleClick} />
    </div>
  )
}

export default Books
