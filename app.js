const CONFIG = require('./config/config')
const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const signup = require('./routes/signup.route')
const login = require('./controllers/login.controller')
const blog = require('./routes/blogs.route')
const comment = require('./routes/comment')
const cors = require('cors')
const { requestLogger } = require('./utils/logger')

const app = express()

// connect to db
require('./middleware/db')(CONFIG.DBURI)

// allow requests from all origins
app.use(cors())

// parse information from request
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// use request logger
app.use(requestLogger)

// set info response
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Home Route of Writing-Room-Article-API!',
    README: 'https://github.com/Psalmzee'
  })
})

app.use('/api/signup', signup)
app.use('/api/login', login)
app.use('/api/blog', blog)
app.use('/api/comment', comment)

// use middleware for unknown endpoints
app.use(unknownEndpoint)

// use error handler middleware
app.use(errorHandler)

module.exports = app
