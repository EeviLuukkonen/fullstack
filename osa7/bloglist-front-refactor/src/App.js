import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

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
      <div className='container'>
        <LoginForm />
        <Notification />
      </div>
    )
  }

  return (
    <div className='container'>
      <Router>
        <Navbar bg="secondary" data-bs-theme="dark" variant='dark'>
          <Container>
            <Navbar.Brand>Blog app</Navbar.Brand>
            <Nav className="me-auto">
              <Link to="/" className="nav-link">Blogs</Link>
              <Link to="/users" className="nav-link">Users</Link>
              <Nav.Link to="/" disabled>{user.name} logged in</Nav.Link>
              <button onClick={() => dispatch(logoutUser())}>Logout</button><p></p>
            </Nav>
          </Container>
        </Navbar>
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
