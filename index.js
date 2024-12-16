import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./logger.js";
import route from "./route.js";
dotenv.config();
const port = process.env.PORT || 3001;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://kal-aa.github.io"],
  })
);
app.use(bodyParser.json());
app.use(logger);
app.use(route);

app.listen(port, () => {
  console.log("You're listening to port", port);
});
