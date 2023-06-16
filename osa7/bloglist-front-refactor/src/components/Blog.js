import { useParams } from 'react-router-dom'
import propTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useState } from 'react'

const Blog = ({ blogs }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  const handleRemove = async (blog) => {
    if (window.confirm(`Do you want to remove ${blog.title}?`)) {
      dispatch(deleteBlog(blog)).catch(() => {
        dispatch(setNotification('error deleting the blog!', 2, 'error'))
      })
      dispatch(setNotification(`Blog ${blog.title} removed!`, 2, 'success'))
    }
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  const submitComment = () => {
    dispatch(commentBlog(blog, comment)).catch(() => {
      dispatch(setNotification('Submission failed! Be sure to write a comment', 2, 'error'))
    })
    setComment('')
  }

  if (!blog || !blog.user || !blog.comments) {
    return null
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <br/><b>Added by: </b>{blog.user.name}
      <br/><b>Likes: </b>{blog.likes}
      <button id='like' onClick={() => dispatch(likeBlog(blog))}>like</button>
      <br/>
      {JSON.parse(window.localStorage.getItem('loggedUser')).name === blog.user.name && (
        <button id='remove' onClick={() => handleRemove(blog)}>remove</button>
      )}
      <h3>Comments:</h3>
      <p>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.comment}</li>
        ))}
      </p>
      <form onSubmit={submitComment}>
        <input
          id='comment'
          type='text'
          value={comment}
          onChange={handleCommentChange}
        />
        <button type='submit'>add comment</button>
      </form>
    </div>
  )
}

Blog.propTypes = {
  blogs: propTypes.array.isRequired,
}

export default Blog