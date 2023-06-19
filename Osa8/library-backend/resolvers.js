const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
    Query: {
      me: (root, args, context) => {
        return context.currentUser
      },
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        if (args.author && args.genre) {
          const author = await Author.findOne({ name: args.author })
          return Book.find({ "genres": args.genre, author: author._id })
        }
        if (args.author) {
          const author = await Author.findOne({ name: args.author })
          return Book.find({ author: author._id })
        }
        if (args.genre) {
          return Book.find({ "genres": args.genre })
        }
        return Book.find({})
      },
      allAuthors: async (root, args) => {
        // filters missing
        return Author.find({})
      },
    },
    Author: {
      bookCount: (root, args, { loaders }) => {
        return loaders.bookCountLoader.load(root._id)
      }
    },
    Book: {
      author: async (root, args, { loaders }) => {
        const author = await Author.findOne(root.author._id)
        author.bookCount = loaders.bookCountLoader.load(root.author._id)
        return author
      },
    },
  
    Mutation: {
      addBook: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
        const book = new Book({ ...args })
        const result = await Author.findOne({ name: args.author })
        if (!result) {
          const newAuthor = new Author({name: args.author})
          try {
            await newAuthor.save()
            book.author = newAuthor
            pubsub.publish('AUTHOR_ADDED', { authorAdded: newAuthor })
          } catch (error) {
            throw new GraphQLError('Saving author failed', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: args.author,
                  error
                }
            })
          }
        }
        else {
          book.author = result
        }
        try {
          await book.save() 
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args,
                error
              }
          })
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      },
      editAuthor: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
        const author = await Author.findOne({ name: args.name })
        if (!author) {
          throw new GraphQLError('Author does not exist', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
        })
        }
        author.born = args.setBornTo
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving date born failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.setBornTo,
                error
              }
          })
        }
        pubsub.publish('AUTHOR_ADDED', { authorAdded: author })
        return author
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
  
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
        const userForToken = {
          username: user.username,
          id: user._id,
        }
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
    },

    Subscription: {
        authorAdded: {
          subscribe: () => pubsub.asyncIterator('AUTHOR_ADDED')
        },
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
          },
      },
  }

  module.exports = resolvers