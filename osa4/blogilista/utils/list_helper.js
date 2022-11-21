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
  
  module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
  }