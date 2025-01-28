
const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { MONGODB_URI, PORT, JWT_SECRET} = require("./config")
const User = require("./models/User")
const Todo = require("./models/Todo")

const app = express()

// Middleware
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))


// Middleware for authentication
const auth = async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "")
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await User.findOne({ _id: decoded._id })
  
      if (!user) {
        throw new Error()
      }
  
      req.token = token
      req.user = user
      next()
    } catch (error) {
      res.status(401).send({ error: "Please authenticate." })
    }
  }

// User Routes
app.post("/register", async (req, res) => {
    try {
      const user = new User(req.body)
      await user.save()
      console.log(JWT_SECRET)
      const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET)
      console.log(token, "INFORMATION")
      res.status(201).send({ user, token })
      
    } catch (error) {
      res.status(400).send({error: "something went wrong"})
    }
  })
  

  app.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user || !(await user.isValidPassword(req.body.password))) {
        return res.status(401).send({ error: "Invalid login credentials" })
      }

      const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET)
      res.send({ user, token })
    } catch (error) {
      res.status(400).send(error)
    }
  })
// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Todo API!" })
})

// GET all todos
app.get("/api/todos", auth, async (req, res) => {
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

