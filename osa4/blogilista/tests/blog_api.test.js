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

describe('when there are initially some blogs saved', () => {
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
        
        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
    
        expect(response.body).toHaveLength(initialBlogs.length+1)
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
        
        const response = await api.get('/api/blogs')
        const nolikes = response.body.find(r => r.author === "testNoLikes")
    
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
    
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(initialBlogs.length)
    })
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const response = await api.get('/api/blogs')
        const blogToDelete = response.body.find(blog => blog.author === "jaakko")
        console.log(blogToDelete)
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await api.get('/api/blogs')
    
        expect(blogsAtEnd.body).toHaveLength(initialBlogs.length-1)
    
        const titles = blogsAtEnd.body.map(r => r.title)
    
        expect(titles).not.toContain(blogToDelete.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})