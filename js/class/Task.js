class Task {
    // Define private member variables for id and text
    #id
    #text

    // Constructor to initialize id and text
    constructor(id, text) {
        this.#id = id
        this.#text = text
    }

    // Implement GetId and getText methods (“getters”)  to enable reading these values “outside” class.
    
    getId() {
        return this.#id
    }

    getText() {
        return this.#text
    }
}

// Export the Task class so that other JavaScript files can import it
export {Task}