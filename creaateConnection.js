import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

let db;
function createConnection() {
  if (!db) {
    db = mysql.createPool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000,
    });

    db.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to the database:", err);
        return;
      }
      console.log("Connected to the database");
      connection.release();
    });
  }

  return db;
}

export default createConnection;
