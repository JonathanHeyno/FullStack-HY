import { useRef, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

import blogService from '../services/blogs'
import NewBlog from './NewBlog'
import Togglable from './Togglable'
import NotificationContext from '../NotificationContext'

const Blogs = () => {
  const queryClient = useQueryClient()

  const [, notificationDispatch] = useContext(NotificationContext)

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
    },
  })

  const result = useQuery('blogs', blogService.getAll, {
    refetchOnWindowFocus: false
  })
  const blogs = result.data

  const blogFormRef = useRef()

  const notifyWith = (message, type = 'info') => {
    notificationDispatch({ message: message, type: type })

    setTimeout(() => {
      notificationDispatch({ message: null })
    }, 3000)
  }

  const createBlog = async (newBlog) => {
    newBlogMutation.mutate(newBlog)
    notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`)
    blogFormRef.current.toggleVisibility()
  }

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <h2>blogs</h2>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      <div>
        <Table striped bordered hover>
          <tbody>
            {blogs.sort(byLikes).map(blog =>
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default Blogs