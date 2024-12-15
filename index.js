import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./logger.js";
import createConnection from "./creaateConnection.js";
import route from "./route.js";

const db = createConnection();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(logger);
app.use(route);

export default app;

// app.listen(PORT, () => {
//   console.log("You're listening to port", PORT);
// });
