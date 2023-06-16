import { useParams } from 'react-router-dom'
import propTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blogs }) => {
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

  if (!blog) {
    return null
  }

  return (
    <div className="viewBlogContent">
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
      {blog.comments.map((comment) => {
        console.log(comment, blog.user)
        return (<li key={comment.id}>{comment.comment}</li>)
      })}
    </div>
  )
}

Blog.propTypes = {
  blogs: propTypes.array.isRequired,
}

export default Blog