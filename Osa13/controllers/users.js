const router = require('express').Router()

const { User, Blog } = require('../models')


router.get('/', async (req, res) => {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
      }
    })
    res.json(users)
  })

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})


router.get('/:id', async (req, res) => {
  const readinglistOptions = { attributes: ['id', 'read'] }
  if (req.query.read) {
    readinglistOptions.where = {
      read: req.query.read
    }
  }
  
  const user = await User.findByPk(req.params.id, { 
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } ,
    include:[{
        model: Blog,
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
        through: readinglistOptions
      }
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})


router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  user.username = req.body.username
  await user.save()
  res.json(user)
  })


module.exports = router