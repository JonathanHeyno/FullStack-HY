import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const STORAGE_KEY = 'loggedBlogAppUser'

const setUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  token = user.token
}

const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    token = user.token
    return user
  }

  return null
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const clearUser = () => {
  localStorage.clear()
  token = null
}

const getToken = () => token

export default {
  setUser,
  getUser,
  getAll,
  clearUser,
  getToken,
}
