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
    Person.find({}).then(persons => {
        res.send(`<p>The phonebook has ${persons.length} entries.</p><p>${new Date()}</p>`);
    })
});

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()));
    }).catch(next)
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON());
            } else {
                res.status(404).end();
            }
        })
        .catch(next);
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(_ => {
            res.status(204).end();
        })
        .catch(next)
});

app.post('/api/persons', (req, res, next) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({
            error: 'entry must have a name and number'
        });
    }
    const person = new Person({ name, number });
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON());
    }).catch(next);
});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({
            error: 'entry must have a name and number'
        });
    }
    Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON());
        })
        .catch(next);
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

    next(error);
}

app.use(errorHandler)


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});