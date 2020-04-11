import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = ({ query, handleQueryChange }) => <div>Search: <input value={query} onChange={handleQueryChange}/></div>;

const PersonForm = ({ handleSubmit, newName, newNumber, handleNewNameChange, handleNewNumberChange }) => (
    <form onSubmit={handleSubmit}>
        <div>
          Name: <input value={newName} onChange={handleNewNameChange}/>
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleNewNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
);

const People = ({ people }) => <div>{people.map(person => <Person key={person.id} person={person}/>)}</div>;

const Person = ({ person }) => <p key={person.name}>{person.name} {person.number}</p>;

const App = () => {
    const [persons, setPersons] = useState([]);
    const [query, setQuery] = useState('');
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');

    useEffect(() => {
      axios
        .get(`http://localhost:3001/persons`)
        .then(res => {
          setPersons(res.data);
        })
    }, []);

    const visiblePeople = query !== '' ? persons.filter(p => RegExp(query, 'i').test(p.name)) : persons;

    const addPerson = (event) => {
        event.preventDefault();
        if (newName === '') {
            alert('Cannot enter a person without a name!');
            return false;
        }
        if (!/^[\d-+. ]*$/.test(newNumber)) { // Obviously, in production use a real validation technique
            alert('Phone number may only contain digits, +, -, or spaces!');
            return false;
        }
        if (persons.some(e => e.name === newName)) {
            alert(`${newName} is already in the phonebook!`);
            return false;
        }
        setPersons([...persons, { name: newName, number: newNumber }]);
        setNewName('');
        setNewNumber('');
    };

    return (
      <div>
        <h2>Phonebook</h2>
        <Search query={query} handleQueryChange={e=>setQuery(e.target.value)}/>
        <br/>
        <PersonForm
          handleSubmit={addPerson}
          newName={newName}
          handleNewNameChange={e=>setNewName(e.target.value)}
          newNumber={newNumber}
          handleNewNumberChange={e=>setNewNumber(e.target.value)}
        />
        <h2>Numbers</h2>
        <People people={visiblePeople}/>
      </div>
    );
}

export default App;