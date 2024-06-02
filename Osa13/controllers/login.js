const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET, PASSWORD } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === PASSWORD

  if (!(user && passwordCorrect && !user.disabled)) {
    return response.status(401).json({
      error: 'invalid username, password or user disabled'
    })
  }

  const oldToken = await Session.findByPk(user.id)
  if (oldToken) {
    oldToken.destroy()
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  Session.create({id: user.id, token: token})

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router