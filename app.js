const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json())

const todos = [
    { id: 1, title: "Learn Express.js", completed: true },
    { id: 2, title: "Build a REST API", completed: false },
  ]

  // Root route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Todo API!" })
  })

// GET all todos
app.get("/api/todos", (req, res) => {
    // const titles = todos.map((todo) => todo.title); 
    res.json(todos)
    // res.json(titles)
  })

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })