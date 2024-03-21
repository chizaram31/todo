//  Add require statement to use environment variables
require('dotenv').config()
// Import required express, cors and pg libraries
const express =require('express')
const cors = require ('cors')
const todoRouter  = require('./routes/todo.js')

// Create an Express application
const app = express()
// Use cors middleware
app.use(cors())
// Allow reading posted values from the client as JSON
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/', todoRouter)


// Instead of using hardcoded value read port from .env file
const port = process.env.PORT

// Set up express app to listen on port
app.listen(port)