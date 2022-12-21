import { useState } from "react"

const Blog = ({ blog }) => {
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
      <button onClick={toggleView}>hide</button><br>
      </br>{blog.author}<br>
      </br>{blog.url}<br>
        </br>likes: {blog.likes}
        <button>like</button>
    </div>
  )
}

export default Blog