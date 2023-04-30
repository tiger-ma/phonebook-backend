const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


app.use(express.json())

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

app.use(cors())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`
  <div>
  Phonebook has info for ${persons.length} people
  <br />
  <br />
  ${new Date()}
  </div>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 9999999)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'missing name and/or number',
    })
  }
  const names = persons.map((person) => person.name.toLowerCase())
  if (names.includes(body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'name already exists in the phonebook',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = [...persons, person]
  console.log(body)
  console.log(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log('started')
})
