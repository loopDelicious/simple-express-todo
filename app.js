require("dotenv").config();

const pm = require("@postman/postman-sdk");

pm.initialize({
  collectionId: "13191452-57207673-27a0-413b-b50d-37f7973752b4",
  apiKey: process.env.POSTMAN_API_KEY || null,
  truncateData: false,
});

// require dependencies so they can be used throughout this code
const express = require("express");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");

// initialize Express.js server and save as a variable
// so it can be referred to as `app`
const app = express();

app.use(bodyParser.json());
app.use(serveStatic("public"));

let todos = []; // In-memory storage for todos

// GET endpoint to fetch all todo items
app.get("/", (req, res) => {
  res.json(todos);
});

// POST endpoint to create a new todo item
// provide `title` and optionally `completed` in the request body as JSON
app.post("/", (req, res) => {
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: req.body.completed || false,
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT endpiont to update an existing todo item with the specified `id`
// provide updated `title` and/or `completed` in the request body as JSON
app.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todo.title = req.body.title || todo.title;
  todo.completed = req.body.completed || todo.completed;
  res.json(todo);
});

// DELETE endpoint to remove an existing todo item with the specified `id`
app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// run the server on port 3000
// for example the app can run locally at this URL: http://localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//
