import express from "express";
import createConnection from "./creaateConnection.js";

const db = createConnection();
const route = express.Router();
route.get("/", (req, res) => {
  res.send("This is Kalab: \nWelcome to my todo-backend");
});

//  CREATE(SIGN UP)
route.post("/sign-up", (req, res) => {
  const email = req.body;
  const checkIfEmailExistsSql = `SELECT email from emails where email = ?;`;
  const postEmailSql = `INSERT INTO emails SET ?;`;
  const fetchEmailIdSql = `SELECT email_id FROM emails WHERE email = ?;`;

  function fetchEmailIdF() {
    db.query(
      fetchEmailIdSql,
      [...Object.values(email)],
      (error, fetchResult) => {
        if (error) {
          console.error("Server error");
          return res
            .status(500)
            .json({ message: "Oops! Server error, try again" });
        }
        console.log("Email posted");
        res.json(fetchResult[0]);
      }
    );
  }
  function postEmailF() {
    db.query(postEmailSql, email, (error, postResult) => {
      if (error) {
        console.error("Error posting email");
        return res
          .status(500)
          .json({ message: "Oops! server error, try again" });
      } else if (postResult.arrowsAffected === 0) {
        console.error("Email not posted");
        return res
          .status(400)
          .json({ message: "Client error! please try again" });
      }
      fetchEmailIdF();
    });
  }
  function checkIfEmailExistsF() {
    db.query(
      checkIfEmailExistsSql,
      [...Object.values(email)],
      (error, ifExistResult) => {
        if (error) {
          console.error("Error posting email");
          return res
            .status(500)
            .json({ message: "Oops! server error, try again" });
        } else if (ifExistResult.length > 0) {
          console.error("Email already exists");
          return res.status(409).json({ message: "Email already exists" });
        }
        postEmailF();
      }
    );
  }
  checkIfEmailExistsF();
});

//  READ(log in)
route.get("/log-in", (req, res) => {
  const email = req.query;
  const fetchEmailIdSql = `SELECT email_id FROM emails WHERE email = ?;`;
  db.query(fetchEmailIdSql, [...Object.values(email)], (error, fetchResult) => {
    if (error) {
      console.error("Server error");
      return res.status(500).json({ message: "Oops! Server error, try again" });
    } else if (fetchResult.length === 0) {
      console.error("Email not found");
      return res.status(400).json({ message: "Email not found" });
    }
    console.log("Email fetched");
    res.json(fetchResult[0]);
  });
});

//  READ all
route.get("/todos/:email_id", (req, res) => {
  const emailId = parseInt(req.params.email_id);
  const todoSql = `SELECT * FROM todos WHERE email_id = ?;`;
  db.query(todoSql, [emailId], (error, todosResult) => {
    if (error) {
      console.error("Error fetching todos");
      return res.status(500).end();
    } else if (todosResult.length === 0) {
      console.error("Todos not found");
      return res.status(404).end();
    } else {
      console.log("Todos fetched");
      res.json(todosResult);
    }
  });
});

//  READ one
route.get("/select-todo/:todo_id", (req, res) => {
  const todoId = parseInt(req.params.todo_id);
  const todoSql = `SELECT * FROM todos WHERE todo_id = ?;`;
  db.query(todoSql, [todoId], (error, todoResult) => {
    if (error) {
      console.error("Erorr fetching todo");
      return res.status(500).end();
    } else if (todoResult.length === 0) {
      console.error("Todos not found");
      return res.status(404).end();
    } else {
      console.log("Todo fetched");
      res.json(todoResult[0]);
    }
  });
});

//  CREATE
route.post("/create-todo/:email_id", (req, res) => {
  const emailId = parseInt(req.params.email_id);
  const newTodo = req.body;
  const values = { email_id: emailId, ...newTodo };
  const todoSql = `INSERT INTO todos SET ?;`;
  db.query(todoSql, values, (error, todoResult) => {
    if (error) {
      console.error("Error posting todo");
      return res.status(500).end();
    } else if (todoResult.affectedRows === 0) {
      console.error("Todo not added");
      return res.status(400).end();
    } else {
      console.log("Todo created");
      res.end();
    }
  });
});

//  UPDATE
route.put("/update-todo/:todo_id", (req, res) => {
  const todoId = parseInt(req.params.todo_id);
  const updatedTodo = req.body;
  const setClause = Object.keys(updatedTodo)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updatedTodo), todoId];
  const todoSql = `UPDATE todos SET ${setClause} WHERE todo_id = ?;`;
  db.query(todoSql, values, (error, todoResult) => {
    if (error) {
      console.error("Error updating todo");
      return res.status(500).end();
    } else if (todoResult.affectedRows === 0) {
      return res.status(404).end();
    } else {
      console.log("Todo updated");
      res.end();
    }
  });
});

//  DELETE
route.delete("/delete-todo/:todo_id", (req, res) => {
  const todoId = parseInt(req.params.todo_id);
  const todoSql = `DELETE FROM todos WHERE todo_id = ?;`;
  db.query(todoSql, [todoId], (error, todoResult) => {
    if (error) {
      console.error("Error deleting todo");
      return res.status(500).end();
    } else if (todoResult.affectedRows === 0) {
      console.error("Todo not deleted");
    } else {
      console.log("Todo deleted");
      res.send();
    }
  });
});

export default route;
