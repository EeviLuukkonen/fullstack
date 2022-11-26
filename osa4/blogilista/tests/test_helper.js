const User = require('../models/user')
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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(u => u.toJSON())
}


module.exports = {
    initialBlogs,
    usersInDb,
    blogsInDb
}