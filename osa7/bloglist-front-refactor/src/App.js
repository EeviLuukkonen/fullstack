import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import User from './components/User'
import Users from './components/Users'

import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import BlogList from './components/BlogList'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  const blogs = useSelector(state => {
    const blogs = [...state.blogs]
    return blogs
  })
  const users = useSelector(state => {
    console.log(state.users)
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
        <Notification />
        <p>
          {user.name} logged in
          <button onClick={() => dispatch(logoutUser())}>logout</button>
        </p>
        <Routes>
          <Route path="/users/:id" element={<User users={users} />} />
          <Route path='/' element={<BlogList blogs={blogs}/>} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
