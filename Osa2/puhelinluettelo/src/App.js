import Numbers from './components/Numbers'
import Forms from './components/Forms'
import Notification from './components/Notification'

import { useState, useEffect } from 'react'

import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [isErrorMessage, setIsErrorMessage] = useState(false)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addNewName = (event) => {
    event.preventDefault()
    const foundPerson = persons.find(person => person.name === newName)
    if (foundPerson) {
      if (window.confirm(`'${newName}' is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...foundPerson, number: newNumber }
        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
            setIsErrorMessage(false)
            setMessage(`'${newName}' number changed`)
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          })
          .catch(error => {
            setIsErrorMessage(true)
            setMessage(`Information of '${newName}' has already been removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
        }
        setNewName('')
        setNewNumber('')
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
        }

        personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setIsErrorMessage(false)
          setMessage(`Added '${newName}'`)
          setNewName('')
          setNewNumber('')
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }
  }

  const handleDelete = (id) => {
    const handler = () => {
      const name = persons.find(person => person.id === id).name
      if (window.confirm(`Delete '${name}'?`)) {
      personService
        .deleteId(id)
        .then(response => {
          setPersons(persons.filter(n => n.id !== id))
          setIsErrorMessage(false)
          setMessage(`Deleted '${name}'`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          alert(
            `this person could not be deleted`
          )
        })
    }}
    return handler
  }

  const handleAddName = (event) => {
    setNewName(event.target.value)
  }

  const handleAddNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleQuery = (event) => {
    setQuery(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isErrorMessage={isErrorMessage} />
      <Forms query={query} handleQuery={handleQuery} addNewName={addNewName} newName={newName} handleAddName={handleAddName} newNumber={newNumber} handleAddNumber={handleAddNumber} />

      
      <h2>Numbers</h2>
      <Numbers persons={persons} query={query} handleDelete={handleDelete} />
    </div>
  )
}

export default App