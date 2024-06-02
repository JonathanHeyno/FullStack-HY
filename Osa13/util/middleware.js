const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const User = require('../models/user')
const Session = require('../models/session')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'SequelizeValidationError') {
      return response.status(400).send({ error: error })
    }
    if (error.name === 'SequelizeDatabaseError') {
        return response.status(404).send({ error: error })
      }
    if (error instanceof TypeError) {
        return response.status(404).send({ error: {message: "blog not found"} })
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return response.status(404).send({ error: error })
    }
    if (error instanceof Error) {
      return response.status(400).send({ error: {message: error} })
  }

    next(error)
}


const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const storedSession = await Session.findByPk(decodedToken.id)
      if (storedSession.token === authorization.substring(7)) {
        req.user = { id: decodedToken.id }
      }
      else {
        return res.status(401).json({ error: 'session expired' })
      }
    } catch (error){
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

next()
}


module.exports = {
    errorHandler,
    tokenExtractor
}