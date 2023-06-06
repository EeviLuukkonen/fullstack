const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')


describe('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordhash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'test', passwordhash })

        await user.save()
    })

    test('succeeds with valid data', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'user',
            name: 'user',
            password: 'password'
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length+1)

        const usernames = usersAtEnd.map(r => r.username)
        expect(usernames).toContain('user')
    })

    test('fails with statuscode 400 if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'test',
            name: 'tester',
            password: '123'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    
    test('fails if username is less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 't',
            name: 'tester',
            password: '3'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('username and password must be at least 3 characters each')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})