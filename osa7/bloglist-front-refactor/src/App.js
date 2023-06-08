import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

import { setNotification } from './reducers/notificationReducer'
import { setBlogs, likeBlog, deleteBlog } from './reducers/blogReducer'

const App = () => {
  const blogFormRef = useRef()
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const blogs = useSelector(state => {
    const blogs = [...state.blogs]
    return blogs
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      dispatch(setBlogs(blogs))
    )
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      dispatch(setNotification(`logged in with ${user.name}`, 2, 'success'))
    } catch (exception) {
      dispatch(setNotification('wrong credentials', 2, 'error'))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
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

  if (user === null) {
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
