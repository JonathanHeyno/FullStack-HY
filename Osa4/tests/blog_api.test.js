const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token_a = ''
let user_a_id = ''

beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password123', 10)
  const user_a = new User({ username: 'user_a', passwordHash })

  await user_a.save()
  user_a_id = user_a._id

  const userForToken = {
    username: user_a.username,
    id: user_a._id,
  }
  token_a = 'bearer '+ jwt.sign(userForToken, process.env.SECRET)
});

beforeEach(async () => {
  await Blog.deleteMany({})
  //console.log(helper.getInitialBlogs())
  await Blog.insertMany(helper.getInitialBlogs(user_a_id))

})


test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id field is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined();
});

describe('adding new blog', () => {
  test('that is valid is successful ', async () => {

    const newBlog = {
      title: 'The Kitchen Hybrid Effect',
      author: 'Tina Bradford',
      url: 'https://blog.kitchenmagic.com/blog/the-hybrid-effect',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({Authorization: token_a, Accept: 'application/json'})
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'The Kitchen Hybrid Effect'
    )
  })

  test('without likes gets 0 likes', async () => {
    const newBlog = {
      title: 'The Kitchen Hybrid Effect',
      author: 'Tina Bradford',
      url: 'https://blog.kitchenmagic.com/blog/the-hybrid-effect'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({Authorization: token_a, Accept: 'application/json'})
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body[helper.initialBlogs.length].likes).toBe(0)
  });

  test('without title is not added', async () => {
    const newBlog = {
      author: 'Tina Bradford',
      url: 'https://blog.kitchenmagic.com/blog/the-hybrid-effect',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({Authorization: token_a, Accept: 'application/json'})
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('without url is not added', async () => {
    const newBlog = {
      title: 'The Kitchen Hybrid Effect',
      author: 'Tina Bradford',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({Authorization: token_a, Accept: 'application/json'})
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('without token fails', async () => {
    const newBlog = {
      title: 'The Kitchen Hybrid Effect',
      author: 'Tina Bradford',
      likes: 5,
      user: user_a_id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deleting blog', () => {
  test('that is valid is successful', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({Authorization: token_a, Accept: 'application/json'})
        .expect(204)
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('that does not exist fails', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set({Authorization: token_a, Accept: 'application/json'})
      .expect(404)
  })
})

describe('modifying an existing blog', () => {
  test('that is valid is successful', async () => {
    const blogs = await helper.blogsInDb()

    const newBlog = {
      likes: 100
    }

    await api
      .put(`/api/blogs/${blogs[0].id}`)
      .send(newBlog)
      .expect(204)
    
      const response = await api.get('/api/blogs')

      expect(response.body[0].likes).toBe(100)
  })

  test('that does not exist fails', async () => {
    const validNonexistingId = await helper.nonExistingId()

    const newBlog = {
      likes: 100
    }

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send(newBlog)
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
})