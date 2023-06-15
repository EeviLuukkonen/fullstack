import { useState } from 'react'
import propTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blog }) => {
  const [view, setView] = useState(false)
  const dispatch = useDispatch()

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

  const handleRemove = async (blog) => {
    if (window.confirm(`Do you want to remove ${blog.title}?`)) {
      dispatch(deleteBlog(blog)).catch(() => {
        dispatch(setNotification('error deleting the blog!', 2, 'error'))
      })}
    dispatch(setNotification(`Blog ${blog.title} removed!`, 2, 'success'))
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
      <button id='like' onClick={() => dispatch(likeBlog(blog))}>like</button>
      <br/>
      {JSON.parse(window.localStorage.getItem('loggedUser')).name === blog.user.name && (
        <button id='remove' onClick={() => handleRemove(blog)}>remove</button>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: propTypes.object.isRequired,
}

export default Blog