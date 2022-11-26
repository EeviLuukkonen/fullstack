const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })

describe('when there are initially some blogs saved', () => {
    test('there are right amount of blogs', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
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
})

describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
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
        
        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(r => r.title)
    
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
        expect(titles).toContain('testiblogi')
    })

    test('with no likes-field succeeds with 0 as likes', async () => {
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
        
        const blogsAtEnd = await helper.blogsInDb()
        const nolikes = blogsAtEnd.find(r => r.author === "testNoLikes")
    
        expect(nolikes.likes).toBe(0)
    })

    test('fails if the data is invalid', async () => {
        const newBlog = {
            "author": "test",
            "likes": 2
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart.find(blog => blog.author === "jaakko")
        console.log(blogToDelete)
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length-1)
    
        const titles = blogsAtEnd.map(r => r.title)
    
        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('updating the number of likes on a blog', () => {
    test('succeeds if the data is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart.find(blog => blog.author === "minä")
        blogToUpdate.likes = 69

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
        
        const updatedBlogs = await helper.blogsInDb()
        
        const likes = updatedBlogs.map(r => r.likes)

        expect(likes).toContain(69)
    })
})

afterAll(() => {
    mongoose.connection.close()
})