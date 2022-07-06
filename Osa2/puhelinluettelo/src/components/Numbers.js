import Info from './Info'

const Numbers = ({persons, query, handleDelete}) => {
    return (
      persons.filter(person => person.name.toLowerCase().includes(query.toLowerCase())).map(person => <Info key={person.name} person={person} handleDelete={handleDelete} />)
    )
  }

export default Numbers