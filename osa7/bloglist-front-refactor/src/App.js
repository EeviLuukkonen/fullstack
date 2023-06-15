import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import User from './components/User'
import Users from './components/Users'
import BlogList from './components/BlogList'
import Blog from './components/Blog'

import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

const App = () => {
  const padding = {
    padding: 5
  }

  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  const blogs = useSelector(state => {
    const blogs = [...state.blogs]
    return blogs
  })
  const users = useSelector(state => {
    const users = [...state.users]
    return users
  })

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

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
      <Router>
        <div>
          <Link style={padding} to='/'>Blogs</Link>
          <Link style={padding} to='/users'>Users</Link>
          {user.name} logged in
          <button onClick={() => dispatch(logoutUser())}>logout</button><p></p>
        </div>
        <h1>Blog app</h1>
        <Notification />
        <Routes>
          <Route path="/users/:id" element={<User users={users} />} />
          <Route path='/' element={<BlogList blogs={blogs}/>} />
          <Route path="/users" element={<Users />} />
          <Route path='/blogs/:id' element={<Blog blogs={blogs}/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
