import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

import { setNotification } from './reducers/notificationReducer'
import { likeBlog, deleteBlog, initializeBlogs } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'

const App = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  const blogs = useSelector(state => {
    const blogs = [...state.blogs]
    return blogs
  })

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (username, password) => {
    dispatch(loginUser(username, password))
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const toggle = () => {
    blogFormRef.current.toggleVisibility()
  }

  const like = (blogObject) => {
    dispatch(likeBlog(blogObject))
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Do you want to remove ${blog.title}?`)) {
      dispatch(deleteBlog(blog)).catch(() => {
        dispatch(setNotification('error deleting the blog!', 2, 'error'))
      })}
    dispatch(setNotification(`Blog ${blog.title} removed!`, 2, 'success'))
  }

  if (!user) {
    return (
      <div>
        <Notification />
        <LoginForm onLogin={handleLogin}/>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <div>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm toggle={toggle} />
        </Togglable>
      </div>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={like}
          handleRemove={handleRemove}
          showRemove={user.name === blog.user.name}
        />))
      }
    </div>
  )
}

export default App
