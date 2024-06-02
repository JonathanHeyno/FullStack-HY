const router = require('express').Router()
const middleware = require('../util/middleware')

const { Readinglist } = require('../models')

router.post('/', middleware.tokenExtractor, async (req, res) => {
  const blogId = req.body.blog_id
  if (blogId) {
    req.body.blogId = blogId
  }

  const userId = req.body.user_id
  if (userId) {
    req.body.userId = userId
  }

  const readinglist= await Readinglist.create({...req.body})
  res.json(readinglist)
})

router.put('/:id', middleware.tokenExtractor, async (req, res) => {
  const reading = await Readinglist.findOne({
    where: {
      userId: req.user.id,
      blogId: req.params.id
    }
  })


  if (req.body.read === true || req.body.read === false) {
    reading.read = req.body.read
    await reading.save()
    res.json(reading)
  }
  else {
    res.status(400).json({ error: "missing parameter 'read'" })
  }
})

module.exports = router