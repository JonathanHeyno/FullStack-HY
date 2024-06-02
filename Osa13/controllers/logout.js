const router = require('express').Router()
const middleware = require('../util/middleware')

const Session = require('../models/session')

router.delete('/', middleware.tokenExtractor, async (req, res) => {
  console.log('OLLAAN LOGOUTISSA')
    const oldToken = await Session.findByPk(req.user.id)
    if (oldToken) {
      oldToken.destroy()
    }
    res.status(204).end()
  })


module.exports = router