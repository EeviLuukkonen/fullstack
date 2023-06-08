import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    createBlog(state, action) {
      state.push(action.payload)
    },
    updateBlogs(state, action) {
      const id = action.payload.id
      return state.map(blog =>
        blog.id !== id ? blog : action.payload
      )
    },
    setBlogs(state, action) {
      return action.payload
    },
    filterBlogs(state, action) {
      const id = action.payload.id
      return state.filter(blog =>
        blog.id !== id
      )
    }
  }
})

export const { createBlog, updateBlogs, setBlogs, filterBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const updatedBlog = await blogService.likeBlog(blog)
    dispatch(updateBlogs(updatedBlog))
  }
}

export const deleteBlog = blog => {
  return async dispatch => {
    await blogService.deleteBlog(blog)
    dispatch(filterBlogs(blog))
  }
}

export default blogSlice.reducer