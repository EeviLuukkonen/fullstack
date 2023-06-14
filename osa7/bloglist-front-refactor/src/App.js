import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import Users from './components/Users'

import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

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
    dispatch(initializeUsers())
  }, [dispatch])

  const toggle = () => {
    blogFormRef.current.toggleVisibility()
  }

  if (!user) {
    return (
      <div>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={() => dispatch(logoutUser())}>logout</button>
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
          showRemove={user.name === blog.user.name}
        />))
      }
      <Users />
    </div>
  )
}

export default App
