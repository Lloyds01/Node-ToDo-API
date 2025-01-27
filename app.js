const express = require("express")
const mongoose = require("mongoose")
// const { MONGODB_URI, PORT } = require("./config")
const MONGODB_URI = 'mongodb://localhost:27017/todoapp';
const PORT = 3000;
const Todo = require("./models/Todo")

const app = express()

// Middleware
app.use(express.json())

// Connect to MongoDB

console.log(MONGODB_URI, "here is the uri")
mongoose
  .connect(MONGODB_URI, )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Todo API!" })
})

// GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find()
    res.json(todos)
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching todos" })
  }
})

// GET a single todo
app.get("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" })
    }
    res.json(todo)
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching the todo" })
  }
})

// POST a new todo
app.post("/api/todos", async (req, res) => {
  try {
    const { title } = req.body
    if (!title) {
      return res.status(400).json({ error: "Title is required" })
    }
    const newTodo = new Todo({ title })
    await newTodo.save()
    res.status(201).json(newTodo)
  } catch (err) {
    res.status(500).json({ error: "An error occurred while creating the todo" })
  }
})

// PUT (update) a todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { title, completed } = req.body
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true, runValidators: true },
    )
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" })
    }
    res.json(updatedTodo)
  } catch (err) {
    res.status(500).json({ error: "An error occurred while updating the todo" })
  }
})

// DELETE a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id)
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" })
    }
    res.json(deletedTodo)
  } catch (err) {
    res.status(500).json({ error: "An error occurred while deleting the todo" })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

