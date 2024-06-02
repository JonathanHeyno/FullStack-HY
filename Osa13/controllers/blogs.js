const { Op } = require('sequelize')
const router = require('express').Router()
const middleware = require('../util/middleware')

const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id, {
    attributes: {
      exclude: ['userId', 'createdAt', 'updatedAt']
    },
    include: {
      model: User,
      attributes: ['name']
    }  })
  next()
}

const blogDataFinder = async (req, res, next) => {
  req.blogWithAuthor = await Blog.findByPk(req.params.id)
  next()
}


router.get('/', async (req, res) => {
  const queryOptions = {
    attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
    include: { model: User, attributes: ['name'] },
    order: [['likes', 'DESC']]
  }

  if (req.query.search) {
    queryOptions.where = {
      [Op.or]: [
        { title: { [Op.iLike]: '%'+req.query.search+'%' } },
        { author: { [Op.iLike]: '%'+req.query.search+'%' } }
      ]
    }
  }

  const blogs = await Blog.findAll(queryOptions)
  res.json(blogs)
})


router.post('/', middleware.tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  req.body.author = user.name
  const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
  res.json(blog)
})

router.get('/:id',blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', middleware.tokenExtractor, blogDataFinder, async (req, res) => {
  if (req.user.id === req.blogWithAuthor.userId) {
    await req.blogWithAuthor.destroy()
    res.status(204).end()
  }
  else {
    res.status(400).send({ error: {message: "user cannot delete blog"} })
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router