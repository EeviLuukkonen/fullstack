import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const blogFormRef = useRef()
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessmessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

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
      console.log('logged in with', username, password)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage('')
      }, 2000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const data = await blogService.create(blogObject)
    console.log(data)
    setBlogs(blogs.concat(data))
    setSuccessmessage(`New blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setSuccessmessage('')
    }, 2000)
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
        setSuccessmessage(`Blog ${blog.title} removed!`)
        setTimeout(() => {
          setSuccessmessage('')
        }, 1000)
      } catch (exception) {
        setErrorMessage('error deleting the blog!')
        setTimeout(() => {
          setErrorMessage('')
        }, 2000)
      }
    }}

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} type="error"/>
        <Notification message={successMessage} type="success"/>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success"/>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <div>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
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
