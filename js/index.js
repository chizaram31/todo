//Add constant variable that holds url for the backend
const BACKEND_ROOT_URL = 'http://localhost:3001';

// Import the Todos class from the specified file
import {Todos} from "./class/Todos.js"

// Create an object of the Todos class with the specified backend URL
const todos = new Todos(BACKEND_ROOT_URL)

// Select the input field and ul element to be able to read the input and add new rows 
const list = document.querySelector('ul');
const input = document.querySelector('input');

//Make input field is disabled by default
input.disabled = true

// Define a function to render a task (function will be used, when a new task is added, or tasks are retrieved from backend)
const renderTask = (task) => {
    // Create a new list item element
    const li = document.createElement('li');
    // Set the class attribute of the list item
    li.setAttribute('class', 'list-group-item');
    //li.innerHTML = text.getText()
    renderSpan(li, task.getText())
    renderLink(li, task.getId())
    // Append the new list item to the todoList
    list.append(li);
}

// To make code more structured, clear, and readable, separate functions for creating span and link are created. 
// Define a function to receive list item element and text as parameters
const renderSpan = (li, text) => {
    const span = li.appendChild(document.createElement('span'))
    span.innerHTML = text
}

// Define a function to render a link for deleting a task
const renderLink = (li, id) => {
    // Create an <a> element for the delete link and append it to the <li> element
    const a = li.appendChild(document.createElement('a'))

    // Set inner HTML of the <a> element to include a trash icon
    a.innerHTML = '<i class="bi bi-trash"></i>'
    // Set CSS style for the <a> element to float it to the right
    a.setAttribute('style','float: right')

    // Add an event listener to the <a> element for click events
    a.addEventListener('click', (event) => {
        // Call the removeTask method of the Todos object to remove the task with the given ID
        todos.removeTask(id).then((removed_id) => {
            // Find the <li> element with the data-key attribute matching the removed task's ID
            const li_to_remove = document.querySelector(`[data-key='${removed_id}']`)

            // If the <li> element is found, remove it from the UI list
            if (li_to_remove) {
                list.removeChild(li_to_remove)
            }
        }).catch((error) => {
             // If an error occurs, show an alert with the error message
            alert(error)
        })
    })
}

// Define the getTasks function to fetch data from the backend and render tasks
const getTasks = async() => {
    // Fetch tasks data from the backend using an HTTP call
    todos.getTasks().then((tasks) => {
        // Loop through each task in the tasks array
        tasks.forEach(task => {
            // Render each task to the UI
            renderTask(task);
        })
        // Enable the input field after data is retrieved
        input.disabled = false
    }) .catch ((error) => {
        // If an error occurs during fetching tasks, display an alert
      alert(error);
    })
}

// Define function to save tasks
const saveTask = async (task) => {
    try {
        // Convert task data to JSON format
        const json = JSON.stringify({description: task});
        // Make a fetch call to the backend to save the task
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: 'post', // Use POST method
            headers: {
                'Content-Type': 'application/json' // Specify JSON content type
            },
            body: json // Provide task data in the request body
        })
        // Return to the response JSON
        return response.json();
    } catch (error) {
        // If an error occurs, alert the user
      alert('Error saving task' + error.message);
    }
}

// Add event listener to input field for keypress event
input.addEventListener('keypress',(event) => {
    // Check if Enter key is pressed 
    if (event.key === 'Enter'){
        // Prevent the default behavior of the Enter key
        event.preventDefault();
        // Get the value of the input field
        const task = input.value.trim()
        // Check if input value is not empty
        if(task !== ""){
            // Update addEventListener so it uses method implemented on Todos class
            todos.addTask(task).then((task)=>{
             renderTask(task)
             //  Reset the input field to an empty string after backend is finished with saving data into database and returns a response
             input.value=''
             input.focus()
            })
        }
    }
})

// Call getTasks function
getTasks()