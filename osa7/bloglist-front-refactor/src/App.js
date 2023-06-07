import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { setNotification } from './reducers/notificationReducer'
import { setBlogs } from './reducers/blogReducer'

const App = () => {
  const blogFormRef = useRef()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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

  const likeBlog = async (blogObject) => {
    const blog = {
      ...blogObject,
      likes: blogObject.likes+1
    }
    await blogService.likeBlog(blog)
    setBlogs(blogs.map(b => b.id === blog.id ? blog : b))
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Do you want to remove ${blog.title}?`)) {
      try {
        await blogService.deleteBlog(blog)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        dispatch(setNotification(`Blog ${blog.title} removed!`, 2, 'success'))
      } catch (exception) {
        dispatch(setNotification('error deleting the blog!', 2, 'error'))
      }}
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <Notification />
        <h2>Log in to application</h2>
        {loginForm()}
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
          handleLike={likeBlog}
          handleRemove={handleRemove}
          showRemove={user.name === blog.user.name}
        />))
      }
    </div>
  )
}

export default App
