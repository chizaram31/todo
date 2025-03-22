const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());
const port = 3001;

// Function to create a database connection
const openDb = () => {
    return new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'todo',
        port: 5432
    });
};

// GET all tasks
app.get("/", (req, res) => {
    const pool = openDb();
    pool.query('SELECT * FROM task')
        .then(result => {
            res.status(200).json(result.rows);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        })
        .finally(() => {
            pool.end(); // Close connection
        });
});

// POST a new task
app.post('/new', (req, res) => {
    const pool = openDb();
    pool.query('INSERT INTO task(description) VALUES ($1) RETURNING *', [req.body.description])
        .then(result => {
            res.status(200).json({ id: result.rows[0].id });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        })
        .finally(() => {
            pool.end(); // Close connection
        });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    li.innerHTML = task;
    list.append(li);
};

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const task = input.value.trim();
        if (task !== '') {
            renderTask(task);
            input.value = '';
        }
    }
});

