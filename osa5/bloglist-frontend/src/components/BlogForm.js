import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
            title:
          <input
            id='title'
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write title'
          />
        </div>
        <div>
            author:
          <input
            id='author'
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author'
          />
        </div>
        <div>
            url:
          <input
            id='url'
            type="text"
            value={newUrl}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write url'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm