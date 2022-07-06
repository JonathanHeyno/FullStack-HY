const Button = ({ handleDelete, id, text }) => 
    <button onClick={handleDelete(id)}>
      {text}
    </button>

const Info = ({ person, handleDelete }) => 
  <p>{person.name} {person.number} <Button handleDelete={handleDelete} id={person.id} text='delete' /></p>

export default Info