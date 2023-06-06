const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.substring(7)
    }
    next()
  }

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken) {
        response.status(401).json({ error: 'token missing or invalid' })
      }
    const user = await User.findById(decodedToken.id)
    if (!user) {
        response.status(404).json({ error: 'user not found' })
    }
    request.user = user
    next()
}

module.exports = {
    tokenExtractor, userExtractor
}