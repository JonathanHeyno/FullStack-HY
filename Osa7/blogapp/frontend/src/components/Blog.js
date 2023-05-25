import { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'
import NotificationContext from '../NotificationContext'
import UserContext from '../UserContext'
import { Table, Form, Button } from 'react-bootstrap'

const Blog = () => {
  const [comment, setComment] = useState('')
  const navigate = useNavigate()
  const [loggedInUser, ] = useContext(UserContext)
  const queryClient = useQueryClient()
  const [, notificationDispatch] = useContext(NotificationContext)
  const id = useParams().id
  const result = useQuery('blogs', blogService.getAll, {
    refetchOnWindowFocus: false
  })
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  const blogs = result.data
  const blog = blogs.find(n => n.id === id)

  if (!blog) {
    return null
  }

  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    },
  })
  const removeBlogMutation = useMutation(blogService.remove, {
    onSuccess: (removedId) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.filter((b) => b.id !== removedId))
    },
  })
  const commentBlogMutation = useMutation(blogService.comment, {
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    },
  })

  const notifyWith = (message, type = 'info') => {
    notificationDispatch({ message: message, type: type })

    setTimeout(() => {
      notificationDispatch({ message: null })
    }, 3000)
  }

  const remove = async () => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`
    )
    if (ok) {
      notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`)
      removeBlogMutation.mutate(blog.id)
      navigate('/')
    }
  }

  const like = async () => {
    const blogToUpdate = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    updateBlogMutation.mutate(blogToUpdate)
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`)
  }

  const addComment = async () => {
    const info = {
      id: blog.id,
      comment: comment,
    }
    notifyWith(`Added comment to ' ${blog.title}' by '${blog.author}`)
    commentBlogMutation.mutate(info)
    setComment('')
  }


  if (loggedInUser && blog.user.username === loggedInUser.username) {
    return (
      <div>
        <h2>{blog.title} by {blog.author}</h2>
        <div><a href={blog.url} target="_blank" rel="noopener noreferrer"> {blog.url}</a>{' '}</div>
        <div>{blog.likes} likes <Button variant="primary" type="button" size="sm" onClick={like}>like</Button></div>
        <div>Added by: {blog.author}</div>
        <Button variant="danger" type="button" onClick={remove}>delete</Button>
        <h4>comments</h4>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              id="comment"
              placeholder="comment"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
          </Form.Group>
        </Form>
        <Button variant="primary" type="button" onClick={addComment}>add comment</Button>
        <Table striped bordered>
          <tbody>
            {blog.comments.map((comment, index) =>
              <tr key={index}>
                <td>
                  {comment}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div><a href={blog.url} target="_blank" rel="noopener noreferrer"> {blog.url}</a>{' '}</div>
      <div>{blog.likes} likes <Button variant="primary" type="button" size="sm" onClick={like}>like</Button></div>
      <div>Added by: {blog.author}</div>
      <h4>comments</h4>
      <Form>
        <Form.Group>
          <Form.Control
            type="text"
            id="comment"
            placeholder="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </Form.Group>
      </Form>
      <Button variant="primary" type="button" onClick={addComment}>add comment</Button>
      <Table striped bordered>
        <tbody>
          {blog.comments.map((comment, index) =>
            <tr key={index}>
              <td>
                {comment}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}


export default Blog