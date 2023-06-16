import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const BlogList = ({ blogs }) => {
  const blogFormRef = useRef()

  const toggle = () => {
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <br></br>
      <h2>Blogs</h2>
      <Table striped>
        <tbody>
          {blogs.sort((a,b) => b.likes - a.likes).map(blog => (
            <tr key={blog.id} >
              <td>
                <Link to={`/blogs/${blog.id}`} className='nav-link'>{blog.title}</Link>
              </td>
              <td>
                {blog.user.name}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br></br>
      <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
        <BlogForm toggle={toggle} />
      </Togglable>
    </div>
  )
}

export default BlogList