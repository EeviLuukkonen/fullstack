import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'
import { useRef } from 'react'

const BlogList = ({ blogs }) => {
  const blogFormRef = useRef()

  const toggle = () => {
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm toggle={toggle} />
      </Togglable>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
        />))
      }
    </div>
  )
}

export default BlogList