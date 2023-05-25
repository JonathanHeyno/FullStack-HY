import { useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import { Navbar, Nav, Button } from 'react-bootstrap'

import loginService from './services/login'
import storageService from './services/storage'
import LoginForm from './components/Login'
import Notification from './components/Notification'
import NotificationContext from './NotificationContext'
import UserContext from './UserContext'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [user, userDispatch] = useContext(UserContext)

  const notifyWith = (message, type = 'info') => {
    notificationDispatch({ message: message, type: type })

    setTimeout(() => {
      notificationDispatch({ message: null })
    }, 3000)
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      userDispatch(user)
      storageService.saveUser(user)
      notifyWith('welcome!')
    } catch (e) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const logout = async () => {
    userDispatch(null)
    storageService.removeUser()
    notifyWith('logged out')
  }

  if (!user) {
    return (
      <div className="container">
        <h2>log in to application</h2>
        <div>{notification}</div>
        <LoginForm login={login} />
      </div>
    )
  }

  const padding = {
    padding: 5
  }


  return (
    <div className="container">
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/">blogs</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">users</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                {user
                  ? <em>{user.name} logged in <Button variant="primary" type="button" onClick={logout}>logout</Button></em>
                  : <Link to="/login">login</Link>
                }
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <h1 className="display-1">blog app</h1>
        <Notification notification={notification}/>

        <Routes>
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Blogs />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
