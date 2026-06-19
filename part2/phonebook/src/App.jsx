import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'
import './index.css'

const Filter = ({ search, onChange }) => (
  <div>Filter by name: <input value={search} onChange={onChange} /></div>
)

const PersonForm = ({ onSubmit, newName, handleNameChange, newNumber, handlePhoneChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handlePhoneChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map(person =>
      <div key={person.id}>{person.name} {person.number} <button onClick={() => onDelete(person.id)}>delete</button></div>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)
  }

  const addNewName = (event) => {
    event.preventDefault()

    const existing = persons.find(person => person.name === newName)

    if (existing) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      phonebookService
        .update(existing.id, { ...existing, number: newNumber })
        .then(response => {
          setPersons(persons.map(p => p.id === existing.id ? response.data : p))
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${existing.name}'s number`, 'success')
        })
        .catch(() => {
          showNotification(`${existing.name} was already removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== existing.id))
        })
      return
    }

    const newPerson = { name: newName, number: newNumber }

    phonebookService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${newName}`, 'success')
      })
  }

  const deletePerson = (id) => {
    phonebookService
      .remove(id)
      .then(() => setPersons(persons.filter(p => p.id !== id)))
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handlePhoneChange = (event) => setNewNumber(event.target.value)

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} type={notification.type} />

      <Filter search={search} onChange={(e) => setSearch(e.target.value)} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addNewName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handlePhoneChange={handlePhoneChange}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </div>
  )
}

export default App
