import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import userService from '../services/user'


const Users = () => {

  const result = useQuery('users', userService.getAll, {
    refetchOnWindowFocus: false
  })
  const users = result.data


  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th># of blogs</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </td>
              <td>
                {user.blogs.length}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Users