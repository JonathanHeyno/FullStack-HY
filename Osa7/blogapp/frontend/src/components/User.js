import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import userService from '../services/user'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const User = () => {
  const id = useParams().id

  const result = useQuery('users', userService.getAll, {
    refetchOnWindowFocus: false
  })
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  const users = result.data
  const user = users.find(n => n.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>Name: {user.name}</h2>
      <h4>Added blogs</h4>
      <Table striped bordered hover>
        <tbody>
          {user.blogs.map(blog =>
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
  )
}

export default User