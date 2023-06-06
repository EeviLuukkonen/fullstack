const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    const reducer = (prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    }

    return blogs.length === 0
        ? []
        : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  const authors = _.groupBy(blogs, "author")
  console.log(authors)

  var amounts = _.map(authors, (list, author) => ({
    author: author,
    blogs: list.length
  }))
  
  return blogs.length === 0
    ? {}
    : _.maxBy(amounts, a => a.blogs)
}

const mostLikes = (blogs) => {
  const authors = _.groupBy(blogs, "author")
  console.log(authors)

  const amounts = _.map(authors, (list, author) => ({
    author: author,
    likes: _.sumBy(list, 'likes')
  }))
  console.log(amounts)

  return blogs.length === 0
    ? {}
    : _.maxBy(amounts, a => a.likes)
}
  
  module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
  }