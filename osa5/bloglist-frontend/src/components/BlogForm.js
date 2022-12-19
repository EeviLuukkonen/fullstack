import { useState } from "react"

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
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            />
        </div>
        <div>
            author:
            <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            />
        </div>
        <div>
            url:
            <input
            type="text"
            value={newUrl}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
            />
        </div>
        <button type="submit">create</button>
        </form>
        </div>
    )
}

export default BlogForm