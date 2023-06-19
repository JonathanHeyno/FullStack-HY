import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import NavigationOptions from './components/NavigationOptions'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED, AUTHOR_ADDED } from './components/queries'
import { updateAuthorCache, updateBookCache } from './components/CacheUpdate'

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}


const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)

      updateBookCache(client.cache, addedBook)
    }
  })

  useSubscription(AUTHOR_ADDED, {
    onData: ({ data }) => {
      const addedAuthor = data.data.authorAdded
      notify(`${addedAuthor.name} added`)
      updateAuthorCache(client.cache, addedAuthor)
    }
  })

  return (
    <div>
      <NavigationOptions setPage={setPage} token={token} setToken={setToken} />
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <LoginForm setToken={setToken} setError={notify} show={page === 'login'} />
      <Recommendations show={page === 'recommendations'} />
    </div>
  )
}

export default App
