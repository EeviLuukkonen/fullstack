import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const blogFormRef = useRef()

  const toggle = () => {
    blogFormRef.current.toggleVisibility()
  }

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm toggle={toggle} />
      </Togglable>
      <br></br>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog => (
        <div key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList