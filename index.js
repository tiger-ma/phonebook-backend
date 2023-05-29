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

app.get('/api/persons/:id', async (request, response, next) => {
  // Person.findById(request.params.id)
  //   .then((person) => {
  //     if (person) {
  //       response.json(note)
  //     } else {
  //       response.status(404).end()
  //     }
  //   })
  //   .catch((error) => next(error))
  try {
    const person = await Person.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const result = await Person.findByIdAndRemove(request.params.id)
    console.log(result)
    if (!result) {
      console.log('already deleted')
    }
    response.status(204).end()
  } catch (error) {
    next(error)
  }
  // const id = Number(request.params.id)
  // persons = persons.filter((person) => person.id !== id)
  // response.status(204).end()
})

// const generateId = () => {
//   return Math.floor(Math.random() * 9999999)
// }

app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: 'missing name and/or number',
  //   })
  // }

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
  try {
    const savedPerson = await person.save()
    response.json(savedPerson)
  } catch (error) {
    console.log(error.name)
    next(error)
  }

  // persons = [...persons, person]
  // console.log(body)
  // console.log(person)
  // response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  // const person = {
  //   name: body.name,
  //   number: body.number,
  // }

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      console.log('tiger')
      response.json(updatedPerson)
    })
    .catch((error) => {
      console.log('testing')
      next(error)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('started')
})
