import { useApolloClient } from '@apollo/client'

const NavigationOptions = ({ setPage, token, setToken }) => {
    const client = useApolloClient()
    const logout = () => {
      setToken(null)
      localStorage.clear()
      client.resetStore()
    }
  
    if (!token) {
      return (
        <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
      </div>
      )
    }
    return (
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>
    )
  }

export default NavigationOptions