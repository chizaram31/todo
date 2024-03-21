//Add require statements and assign express.Router to a variable.
const express =require('express')
const { query } = require('../helpers/db.js')

const todoRouter = express.Router()

// Define a route for the root endpoint '/'
todoRouter.get("/",async (req, res) => {
    // Retrieve data from the database
    console.log(query)
    try {
        const result= await query('select * from task')
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// Define a route to handle POST requests to create a new task
todoRouter.post("/new",async (req, res) => {
    try {
      // Execute SQL INSERT statement to insert a new task into the database
      const result = await query('insert into task (description) values ($1) returning *',
      [req.body.description])
      // If successful, send a success response with status code 200 and the ID of the newly inserted task
      res.status(200).json({id: result.rows[0].id})
    } catch (error){
        console.log(error)
        res.statusMessage = error
        // If an error occurs, send an error response with status code 500
        res.status(500).json({error: error}) 
    }
})

// Implement deletion functionality to the backend.  Create delete method, that receives id as query parameter
todoRouter.delete("/delete/:id", async(req,res) => {
    // Extract the task ID from the request parameters
    const id = Number(req.params.id)
    try {
      // Execute SQL DELETE statement to delete the task by ID
      const result = await query('delete from task where id = $1',
      [id])
      // If successful, send a success response with status code 200 and the deleted task ID
      res.status(200).json({id:id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        // If an error occurs, send an error response with status code 500
        res.status(500).json({error: error}) 
    }
})

module.exports = todoRouter
