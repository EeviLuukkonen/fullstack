const bcrypt = require('bcrypt')
const { response, request } = require('../app')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordhash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordhash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = usersRouter