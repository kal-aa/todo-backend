import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({ origin: ["http://localhost:4000", "https://kal-aa.github.io"] })
);
app.use(bodyParser.json());

const loadData = () => {
  return JSON.parse(fs.readFileSync("public/assets/data.json"));
};

const saveData = (data) => {
  fs.writeFileSync("public/assets/data.json", JSON.stringify(data, null, 2));
};

app.get('/', (req, res) => {
  res.send('Welcome to my todo-backend')
})

//  READ all
app.get("/todo", (req, res) => {
  const data = loadData();
  res.json(data);
});

//  READ with id
app.get("/select-todo/:id", (req, res) => {
  const todos = loadData();
  const id = req.params.id;
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    res.send(todo);
  } else {
    res.status(404).send({ message: "Item not found" });
  }
});

//  CREATE
app.post("/create-todo", (req, res) => {
  const data = loadData();
  const item = req.body;
  const id = `${item.title}${Math.random()}`;
  const newItem = { id, ...item };
  data.push(newItem);
  saveData(data);
  res.status(201).json(newItem);
});

//  UPDATE
app.put("/update-todo/:id", (req, res) => {
  const data = loadData();
  const id = req.params.id;
  const updatedItem = req.body;
  const itemId = `${updatedItem.title}${Math.random()}`;
  const newObject = { itemId, ...updatedItem };

  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data[index] = newObject;
    saveData(data);
    res.end();
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

//  DELETE
app.delete("/delete-todo/:id", (req, res) => {
  const data = loadData();
  const id = req.params.id;
  const newData = data.filter((item) => item.id !== id);
  if (data.length !== newData.length) {
    saveData(newData);
    res.end();
  } else {
    res.status(404).json({ message: "Item not foune" });
  }
});

export default (req, res) => {
  app(req, res);
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
