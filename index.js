const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const cors = require('cors')



const app = express()
app.use(cors())
app.use(express.json())

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

let personcount = persons.length

const generateId = () => {
    const maxId = personcount > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const currentTime = new Date().toString()
    response.send(`<p>Phonebook has info for ${personcount} people</p><p>${currentTime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/person/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.content) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }
    const existingPerson = persons.find(person => person.content === body.content)
    if (existingPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
  
    const person = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }
  
    persons = persons.concat(person)
    response.json(person)
  })

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)