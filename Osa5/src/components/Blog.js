import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ( { blog, addLike, remove } ) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  let removeButtonStyle = {
    display: 'none'
  }
  if (window.localStorage.getItem('loggedBlogappUser')) {
    const showRemoveButton = blog.user.username === JSON.parse(window.localStorage.getItem('loggedBlogappUser')).username
    removeButtonStyle = {
      display: showRemoveButton ? '' : 'none'
    }
  }

  const [viewMore, setViewMore] = useState(false)

  const toggleView = () => {
    setViewMore(!viewMore)
  }

  if (viewMore) {
    return (
      <div style={blogStyle} className="fullContent">
        <div>
          {blog.title} {blog.author} <button onClick={toggleView}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes ? blog.likes : 0} <button onClick={() => addLike(blog)}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <button style={removeButtonStyle} onClick={() => remove(blog)}>remove</button>
      </div>
    )
  }
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleView}>view</button>
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func,
  remove: PropTypes.func
}

export default Blog