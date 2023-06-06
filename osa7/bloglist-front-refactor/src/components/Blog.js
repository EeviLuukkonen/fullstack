import { useState } from 'react'
import propTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleRemove, showRemove }) => {
  const [view, setView] = useState(false)

  const toggleView = () => {
    setView(!view)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!view) {
    return (
      <div style={blogStyle} >
        {blog.title} {blog.author}
        <button onClick={toggleView}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle} className="viewBlogContent">
      <b>Title: </b>{blog.title}
      <button onClick={toggleView}>hide</button>
      <br/><b>Author: </b>{blog.author}
      <br/><b>Url: </b>{blog.url}
      <br/><b>Added by: </b>{blog.user.name}
      <br/><b>Likes: </b>{blog.likes}
      <button id='like' onClick={() => handleLike(blog)}>like</button>
      <br/>
      {showRemove && (
        <button id='remove' onClick={() => handleRemove(blog)}>remove</button>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: propTypes.object.isRequired,
  handleLike: propTypes.func.isRequired,
  handleRemove: propTypes.func.isRequired,
  showRemove: propTypes.bool.isRequired
}

export default Blog