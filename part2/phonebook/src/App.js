import React, { useState, useEffect } from 'react';
import phonebookService from './services/phonebook.js';

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

const People = ({ people, handleRemove }) => <div>{people.map(person => <Person key={person.id} person={person} handleRemove={handleRemove(person.id)}/>)}</div>;

const Person = ({ person, handleRemove }) => <p key={person.name}>{person.name} {person.number} <button onClick={handleRemove}>Delete</button></p>;

const App = () => {
    const [persons, setPersons] = useState([]);
    const [query, setQuery] = useState('');
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');

    useEffect(() => {
        phonebookService
            .getAll()
            .then(data => {
                setPersons(data);
            })
    }, []);

    const visiblePeople = (query !== '' ? persons.filter(p => RegExp(query, 'i').test(p.name)) : persons).slice().sort((a,b)=>a.name > b.name ? 1 : -1);

    const addPerson = event => {
        const newPersonData = { name: newName, number: newNumber };
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
            if (window.confirm(`Overwrite the entry for ${newName}?`)) {
                phonebookService
                    .update(persons.filter(p=>p.name === newName)[0].id, newPersonData)
                    .then(data => {
                        setPersons([...persons.filter(person => data.name !== person.name), data]);
                        setNewName('');
                        setNewNumber('');
                    });
                return true;
            }
            return false;
        }


        phonebookService
            .create(newPersonData)
            .then(data => {
                setPersons([...persons, data]);
                setNewName('');
                setNewNumber('');
            });
    };

    const removePerson = id => event => {
        event.preventDefault();
        if (window.confirm('Are you sure you want to delete this entry?')) {
            phonebookService
                .remove(id)
                .then(_ => {
                    setPersons(persons.filter(person => person.id !== id));
                });
        }
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
        <People people={visiblePeople} handleRemove={removePerson}/>
      </div>
    );
}

export default App;