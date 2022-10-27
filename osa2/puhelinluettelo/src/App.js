import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={type}>
      {message}
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
    <div>
      name: 
      <input 
        value={props.newName}
        onChange={props.handleNameChange}
      />
    </div>
    <div>
      number: 
      <input 
        value={props.newNumber}
        onChange={props.handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = ({ namesToShow, deletePerson }) => {
  return (
    <div>
    {namesToShow.map(person => 
      <p key={person.id}> 
        {person.name} {person.number}
        <button onClick={() => deletePerson(person)}>delete</button>
      </p>
    )}
  </div>
  )
}

const Filter = (props) => {
  return (
    <form>
      filter shown with 
      <input value={props.filter} onChange={props.handleFilter} />
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [SuccessMessage, setSuccessMessage] = useState(null)
  const [ErrorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const namesToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase()))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const exists = persons.find(person => person.name === newName)
    if (exists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
        {
          console.log('korvataan uudella')
          const changedObject = {
            name: newName,
            number: newNumber,
            id: exists.id
          }
          personService
            .put(`/api/persons/${exists.id}`, changedObject)
            .catch(error => {
              setErrorMessage(`Information of ${newName} has already been removed from server`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 3000)
              setPersons(persons.filter(p => p.id !== exists.id))
            })
            .then(response => {
              setPersons(persons.map(p => p.id !== exists.id ? p : response.data))
              setSuccessMessage(`Changed the number of ${newName} to ${newNumber}`)
              setTimeout(() => {
                setSuccessMessage(null)
              }, 3000)
            })
        }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(nameObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setSuccessMessage(`Added ${newName}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000)
        })
        .catch(error => {
          setErrorMessage(error.response.data)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`))
    {
      personService
      .remove(`/api/persons/${person.id}`)
      .then(response => {
        setPersons(persons.filter(p => p.id !== person.id))
        setSuccessMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={SuccessMessage} type='success'/>
      <Notification message={ErrorMessage} type='error' />
      <Filter filter={filter} handleFilter={handleFilter}/>
      <h2>Add a new</h2>
      <PersonForm 
        addName={addName} 
        name={newName} 
        number={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons namesToShow={namesToShow} deletePerson={deletePerson} />
    </div>
  )

}

export default App