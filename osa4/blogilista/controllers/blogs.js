const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({
        error: 'missing title'
    })
  }
  if (!body.url) {
    return response.status(400).json({
        error: 'missing url'
    })
  }

  const user = request.user
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog || !user) {
    return response.status(404).json({ error: 'user or blog not found!' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'blog can only be deleted by its creator' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).end()
})

module.exports = blogsRouter