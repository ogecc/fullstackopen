import { useState } from 'react'

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

const Persons = ({ persons }) => (
  <div>
    {persons.map(person =>
      <div key={person.id}>{person.name} {person.number}</div>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const addNewName = (event) => {
    event.preventDefault()

    const exists = persons.some(person => person.name === newName)
    if (exists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: Math.max(...persons.map(p => p.id), 0) + 1
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handlePhoneChange = (event) => setNewNumber(event.target.value)

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

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

      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App
