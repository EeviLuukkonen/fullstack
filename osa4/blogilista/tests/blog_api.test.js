const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        "author": "minä",
        "title": "elämäni",
        "url": "www.com",
        "likes": 0
    },
    {
        "author": "jaakko",
        "title": "sirkka",
        "url": "www.ho",
        "likes": 3
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })

test('there are right amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blogs have field called id', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(r => r.id)

    expect(ids).toBeDefined()
})

test('a valid blog can be added', async () => {
    const newBlog = {
        "author": "uusi",
        "title": "testiblogi",
        "url": "www.jee.com",
        "likes": 13
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length+1)
    expect(titles).toContain('testiblogi')
})

test('if likes isn`t defined it`s value is 0', async () => {
    const newBlog = {
        "author": "testNoLikes",
        "title": "testiblogi",
        "url": "www.jee.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const nolikes = response.body.find(r => r.author === "testNoLikes")
    console.log(nolikes)

    expect(nolikes.likes).toBe(0)
})

afterAll(() => {
    mongoose.connection.close()
})