require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// app.get('/info', (request, response) => {
//   response.send(`
//   <div>
//   Phonebook has info for ${persons.length} people
//   <br />
//   <br />
//   ${new Date()}
//   </div>
//   `)
// })

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(note)
    })
    .catch((error) => {
      response.status(404).end()
    })
  // const id = Number(request.params.id)

  // const person = persons.find((person) => person.id === id)
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
})

app.delete('/api/persons/:id', async (request, response) => {
  await Person.findByIdAndRemove(request.params.id)
  response.status(204).end()
  // const id = Number(request.params.id)
  // persons = persons.filter((person) => person.id !== id)
  // response.status(204).end()
})

// const generateId = () => {
//   return Math.floor(Math.random() * 9999999)
// }

app.post('/api/persons', async (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'missing name and/or number',
    })
  }

  const persons = await Person.find({})
  const names = persons.map((person) => person.name.toLowerCase())

  if (names.includes(body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'name already exists in the phonebook',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // person.save().then(savedPerson => {
  //   console.log('saved to database')
  //   response.json(savedNote)
  // }).catch(error => {
  //   console.log('error saving to database')
  //   console.log(error)
  // })
  const savedPerson = await person.save()
  response.json(savedPerson)

  // persons = [...persons, person]
  // console.log(body)
  // console.log(person)
  // response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})
