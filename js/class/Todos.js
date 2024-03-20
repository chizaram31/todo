import {Task} from './Task.js';

// Define class for Todos to be able to contain logic for retrieving and adding new tasks
class Todos {
    #tasks = []
    #backend_url = ''

    constructor(url) {      
        this.#backend_url = url
    }

    /*
    Define the getTasks method to fetch tasks from the backend.
    This method is asynchronous, returning a Promise that resolves with the retrieved tasks or rejects with an error
    */
    getTasks = () => {
        // Return a new Promise to handle asynchronous operation
        return new Promise(async (resolve, reject) => {
            // Use fetch to make an HTTP call to the backend URL
            fetch(this.#backend_url)
            // Parse the response JSON
            .then(response => response.json())
            // Process the JSON data using the private method readJson
            .then(json => {
                this.#readJson(json)
                // Resolve the promise with the retrieved tasks
                resolve(this.#tasks)
            },(error) => {
                // If an error occurs, reject the promise with the error information
                reject(error)
            })
        })
    }

    // Add public method to add a new task to the backend
    addTask = (text) => {
        // Return a new Promise to handle asynchronous operation
        return new Promise(async (resolve, reject) => {
            // Convert task data to JSON format
            const json = JSON.stringify({description: text})
            // Make a fetch call to the backend to add the new task
            fetch(this.#backend_url + '/new', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            })
            .then((response) => response.json())
            .then((json) => {
                // Resolve the promise and add to the Todos array
                resolve(this.#addToArray(json.id, text))
            },(error) => {
                // If an error occurs, reject the promise with the error information
                reject(error)
            })
        })
    }
    
    // Add method to remove task 
    removeTask = (id) => {
         // Return a new Promise to handle asynchronous operation
        return new Promise(async (resolve, reject) => {
            // Make a fetch call to the backend to delete the task by ID
            fetch(this.#backend_url + '/delete/' + id, {
                method: 'delete'
            })
            .then((response) => response.json())
            .then((json) => {
                // Remove the task from the array based on its ID
                this.#removeFromArray(id)
                // Resolve the promise with the ID of the deleted task
                resolve(json.id)
            },(error) => {
                // If an error occurs, reject the promise with the error information
                reject(error)
            })
        })
    }

    #readJson = (tasksAsJson) => {
        tasksAsJson.forEach(node => {
            const task = new Task(node.id, node.description)
            this.#tasks.push(task)
        })
    }

    // Add private method to add new task to tasks array
    #addToArray = (id, text) => {
       const task = new Task(id, text)
         this.#tasks.push(task)
         // return added task
         return task
    }

    // Add a new private method that removes task from array based on id
    #removeFromArray = (id) => {
        // Filter out the task with the given ID and assign the filtered array back to #tasks
        const arrayWithoutRemoved = this.#tasks.filter(task => task.id !== id)
        this.#tasks  = arrayWithoutRemoved;
    }
}



export {Todos}