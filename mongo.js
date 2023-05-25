const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

//const databaseName = 'phonebookApp'

const url = `mongodb+srv://fullstack:${password}@cluster0.jitffgi.mongodb.net/${databaseName}?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//save

if (process.argv.length < 3) {
  console.log('no password provided')
  process.exit(1)
} else if (process.argv.length === 3) {
  //print all
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  //save
  const person = Person({
    name: name,
    number: number,
  })

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
