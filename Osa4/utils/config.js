require('dotenv').config()

let PORT = process.env.PORT
let mongoUrl = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
    mongoUrl,
    PORT
  }