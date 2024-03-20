// Import required express, cors and pg libraries
const express =require('express')
const cors = require ('cors')
const {Pool} = require('pg')

// Create an Express application
const app = express()

// Use cors middleware
app.use(cors())
// Allow reading posted values from the client as JSON
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// 
const port = 3001

// Define a route for the root endpoint '/'
app.get("/",(req, res) => {
    // Retrieve data from the database
    const pool = openDb()

    pool.query('select * from task', (error,result) => {
        if (error){
            // If an error occurs, send an error response with status code 500
            res.status(500).json({error:error.message})
        }
            // Send the retrieved data as JSON response
            res.status(200).json(result.rows)
    })
})

// Function to initialize the database connection pool
function openDb() {
    // Provide required credentials and information
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: '1905',
        port: 5432 // Can have different values if database is running on a different port
    });
    return pool;
}

// Define a route to handle POST requests to create a new task
app.post("/new",(req, res) => {
    const pool = openDb()

    // Execute SQL INSERT statement to insert a new task into the database
    pool.query('insert into task (description) values ($1) returning *',
    [req.body.description],
    (error,result) => {
        // If an error occurs, send an error response with status code 500
        if(error) {
            res.status(500).json({error: error.message})  
        } else{
            // If successful, send a success response with status code 200 and the ID of the newly inserted task
            res.status(200).json({id: result.rows[0].id})
        }
    })
})

// Implement deletion functionality to the backend.  Create delete method, that receives id as query parameter
app.delete("/delete/:id", async(req,res) => {
    // Open a database connection pool
    const pool = openDb()
     // Extract the task ID from the request parameters
    const id = parseInt(req.params.id)

    // Execute SQL DELETE statement to delete the task by ID
    pool.query('delete from task where id = $1',
    [id],
    (error, result) =>{
        if(error) {
             // If an error occurs, send an error response with status code 500
            res.status(500).json({error:error.message})
        } else {
            // If successful, send a success response with status code 200 and the deleted task ID
            res.status(200).json({id:id})
        }
    })
})

// Set up express app to listen on port
app.listen(port)