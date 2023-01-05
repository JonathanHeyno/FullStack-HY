import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState('error')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs.sort((a, b) => (b.likes ? b.likes : 0) - (a.likes ? a.likes : 0)))
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationClass('error')
      setNotificationMessage('wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
  }

  const loginForm = () => {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} id="username" name="Username" autoComplete="username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            password
            <input type="password" value={password} id="password" name="Password" autoComplete="current-password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    )
  }

  const blogFormRef = useRef()

  const mainView = () => {
    return (
      <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <ul id='blogList' className="no-bullets">
          {blogs.map(blog =>
            <li key={blog.id}><Blog blog={blog} addLike={addLike} remove={remove} /></li>
          )}
        </ul>
      </div>
    )
  }

  const addLike = (newBlog) => {
    const changedBlog = { ...newBlog, user: newBlog.user.id, likes: newBlog.likes+1 }
    blogService
      .update(newBlog.id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== newBlog.id ? blog : returnedBlog).sort((a, b) => (b.likes ? b.likes : 0) - (a.likes ? a.likes : 0)))
      })
      .catch( () => {
        setNotificationClass('error')
        setNotificationMessage('could not add like')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
    blogFormRef.current.toggleVisibility()
    setNotificationClass('success')
    setNotificationMessage('a new blog ' + blogObject.title + ' by ' + blogObject.author + ' added')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const remove = (oldBlog) => {
    if (window.confirm('Remove blog ' + oldBlog.title + ' by ' + oldBlog.author + '?')) {
      blogService
        .remove(oldBlog.id)
        .then(
          setBlogs(blogs.filter(blog => blog.id !== oldBlog.id).sort((a, b) => (b.likes ? b.likes : 0) - (a.likes ? a.likes : 0)))
        )
        .catch( () => {
          setNotificationClass('error')
          setNotificationMessage('could not remove blog')
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={notificationMessage} notificationClass={notificationClass} />

      {user === null ?
        loginForm() :
        mainView()
      }

    </div>
  )
}

export default App
