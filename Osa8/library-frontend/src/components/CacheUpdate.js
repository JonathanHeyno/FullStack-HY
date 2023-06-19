import { ALL_BOOKS, ALL_AUTHORS, GENRE_BOOKS } from './queries'

export const updateBookCache = (cache, addedBook) => {
    const { allAuthors } = cache.readQuery({ query: ALL_AUTHORS })
    const newAuthors = allAuthors.map(a => a.id === addedBook.author.id ? addedBook.author : a)
  
    if (newAuthors.includes(addedBook.author)) {
      cache.writeQuery({
        query: ALL_AUTHORS,
        data: {
          allAuthors: [
            ...newAuthors
          ]
        }
      })
    }
  
    else {
      cache.writeQuery({
        query: ALL_AUTHORS,
        data: {
          allAuthors: [
            ...newAuthors,
            addedBook.author
          ]
        }
      })
    }
  
    const { allBooks } = cache.readQuery({
      query: ALL_BOOKS
    })
    
    const newBooks = allBooks.map(b => b.id === addedBook.id ? addedBook : b)
  
    if (newBooks.includes(addedBook)) {
      cache.writeQuery({
        query: ALL_BOOKS,
        data: {
          allBooks: [
            ...newBooks
          ]
        }
      })
      cache.writeQuery({
        query: GENRE_BOOKS,
        data: {
          allBooks: [
            ...newBooks
          ]
        }
      })
    }
  
    else {
      cache.writeQuery({
        query: ALL_BOOKS,
        data: {
          allBooks: [
            ...newBooks,
            addedBook
          ]
        }
      })
      cache.writeQuery({
        query: GENRE_BOOKS,
        data: {
          allBooks: [
            ...newBooks,
            addedBook
          ]
        }
      })
    }
  }
  
export const updateAuthorCache = (cache, addedAuthor) => {
    const { allAuthors } = cache.readQuery({ query: ALL_AUTHORS })
    const newAuthors = allAuthors.map(a => a.id === addedAuthor.id ? addedAuthor : a)
  
    if (newAuthors.includes(addedAuthor)) {
      cache.writeQuery({
        query: ALL_AUTHORS,
        data: {
          allAuthors: [
            ...newAuthors
          ]
        }
      })
    }
  
    else {
      cache.writeQuery({
        query: ALL_AUTHORS,
        data: {
          allAuthors: [
            ...newAuthors,
            addedAuthor
          ]
        }
      })
    }
}