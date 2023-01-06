import { useState } from "react"

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [view, setView] = useState(false)

  const toggleView = () => {
    setView(!view)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!view) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleView}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title}
      <button onClick={toggleView}>hide</button>
      <br/>{blog.author}
      <br/>{blog.url}
      <br/>likes: {blog.likes}
        <button onClick={() => handleLike(blog)}>like</button>
      <br/>
        {user === blog.user.name && (
          <button onClick={() => handleRemove(blog)}>remove</button>
        )}
    </div>
  )
}

export default Blog