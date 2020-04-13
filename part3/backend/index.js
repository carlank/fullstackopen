const http = require('http');
const express = require('express');
const morgan = require('morgan');

morgan.token('body', req => JSON.stringify(req.body));
const app = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [{
        "name": "hallo",
        "number": "123",
        "id": 1
    },
    {
        "name": "test",
        "number": "1234",
        "id": 2
    },
    {
        "name": "john jacob jingleheimer-schmidt",
        "number": "13121415",
        "id": 3
    },
    {
        "name": "willy wonka",
        "number": "9191",
        "id": 4
    },
    {
        "name": "peter piper",
        "number": "298765",
        "id": 5
    },
    {
        "name": "john cena",
        "number": "8587623",
        "id": 6
    },
    {
        "name": "dnojgnioer",
        "number": "32198",
        "id": 7
    },
    {
        "name": "bc",
        "number": "123",
        "id": 8
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/info', (req, res) => {
	res.send(`<p>The phonebook has ${persons.length} entries.</p><p>${new Date()}</p>`);
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = +req.params.id;
    const person = persons.find(person => person.id === id);
    if(person){
    	res.json(person);
    } else{
    	res.status(404).end();
    }
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
	if(persons.find(person=>person.name === name)){
		return res.status(400).json({
			error: 'name must be unique'
		});
	}
	let id;
	do{ id = generateID() } while(persons.find(person=>person.id===id))
	const newPerson = { name, number, id};
	persons = [...persons, newPerson];
	res.status(200).json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});