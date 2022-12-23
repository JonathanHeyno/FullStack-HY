const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(error.message)
    }
    
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
        //return response.status(401).json({ error: 'token invalid' })
      }
    
    next(error)
  }

  const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.substring(7)
    }
    next()
  }

  const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      const user = await User.findById(decodedToken.id)
      //request.user = user.id.toString()
      if (user) {
        // const new_user = {
        //     username: user.username,
        //     name: user.name,
        //     passwordHash: user.passwordHash,
        //     id: user._id.toString(),
        //   }
        //   request.user = new_user
        request.user = user
      }
      
      //request.user = user.toString()
    }
    next()
  }

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}