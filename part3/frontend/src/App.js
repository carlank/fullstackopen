import React, { useState, useEffect } from 'react';
import phonebookService from './services/phonebook.js';
import './index.css';

const Notification = ({ message, type = "notification" }) => message === null ? null : <div className={type}>{message}</div>

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
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [notificationType, setNotificationType] = useState('notification');

    useEffect(() => {
        phonebookService
            .getAll()
            .then(data => {
                setPersons(data);
            })
    }, []);

    const visiblePeople = (query !== '' ? persons.filter(p => RegExp(query, 'i').test(p.name)) : persons).slice().sort((a, b) => a.name > b.name ? 1 : -1);

    const notify = (message, type = 'notification') => {
        setNotificationMessage(message);
        setNotificationType(type);
        setTimeout(() => {
            setNotificationMessage(null);
        }, 3000);
    }

    const addPerson = event => {
        const newPersonData = { name: newName, number: newNumber };
        event.preventDefault();
        if (newName === '') {
            notify('Cannot add a person without a name!', 'error');
            return false;
        }
        if (!/^[\d-+. ]*$/.test(newNumber)) { // Obviously, in production use a real validation technique
            notify('Phone number may only contain digits, +, -, or spaces!', 'error');
            return false;
        }
        if (persons.some(e => e.name === newName)) {
            if (window.confirm(`Overwrite the entry for ${newName}?`)) {
                phonebookService
                    .update(persons.filter(p => p.name === newName)[0].id, newPersonData)
                    .then(data => {
                        notify(`${data.name} has been updated!`);
                        setPersons([...persons.filter(person => data.name !== person.name), data]);
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch(err => notify(`${newName} could not be updated; out of sync with server?`));
                return true;
            }
            return false;
        }


        phonebookService
            .create(newPersonData)
            .then(data => {
                notify(`${data.name} has been created!`);
                setPersons([...persons, data]);
                setNewName('');
                setNewNumber('');
            })
            .catch(err => {
                console.log(err.response.data.error);
                notify(err.response.data.error, 'error');
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
        <Notification message={notificationMessage} type={notificationType}/>
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