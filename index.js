import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./logger.js";
import route from "./route.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(logger);
app.use(route);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("You're listening to port", PORT);
});
