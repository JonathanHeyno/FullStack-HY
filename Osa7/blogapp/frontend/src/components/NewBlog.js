import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await createBlog({ title, author, url })
  }

  return (
    <div>
      <h4>Create a new blog</h4>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            id="title"
            type="text"
            placeholder="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <Form.Label>author:</Form.Label>

          <Form.Control
            id="author"
            type="text"
            placeholder="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />

          <Form.Label>url:</Form.Label>

          <Form.Control
            id="url"
            type="text"
            placeholder="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />

          <Button variant="primary" type="submit">
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BlogForm
