require('dotenv').config()

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person.js');

morgan.token('body', req => JSON.stringify(req.body));

const app = express();
app.use(express.json());
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (req, res) => {
	res.send(`<p>The phonebook has ${'bad'} entries.</p><p>${new Date()}</p>`);
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person=>person.toJSON()));
    })
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person.toJSON());
    })
});

app.delete('/api/persons/:id', (req, res) => {
	const id = +req.params.id;
	persons = persons.filter(person => person.id !== id);
	res.status(204).end();
});

const generateID = (seed) => Math.abs(~~(Math.random() * 1e10));

app.post('/api/persons', (req, res) => {
	const body = req.body;
	const name = body.name;
	const number = body.number
	if(!name || !number){
		return res.status(400).json({
			error: 'entry must have a name and number'
		});
	}
	// if(persons.find(person=>person.name === name)){
	// 	return res.status(400).json({
	// 		error: 'name must be unique'
	// 	});
	// }
	const person = new Person({ name, number});
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON());
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});