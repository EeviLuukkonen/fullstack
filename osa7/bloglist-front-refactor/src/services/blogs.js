import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const likeBlog = async blogObject => {
  const blog = {
    ...blogObject,
    likes: blogObject.likes+1
  }
  const url = baseUrl + '/' + blog.id
  await axios.put(url, blog)
  return blog
}

const deleteBlog = async blog => {
  const url = baseUrl + '/' + blog.id
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(url, config)
  return response
}

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, setToken, create, likeBlog, deleteBlog }