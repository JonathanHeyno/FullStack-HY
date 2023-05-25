import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login(username, password)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>username:</Form.Label>

        <Form.Control
          type="text"
          id="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />

        <Form.Label>password:</Form.Label>
        <Form.Control
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />

        <Button variant="primary" type="submit">
            login
        </Button>
      </Form.Group>
    </Form>
  )
}

export default LoginForm
