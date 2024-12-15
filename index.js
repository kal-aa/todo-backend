import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./logger.js";
import route from "./route.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "https://todo-backend-ten-tau.vercel.app",
    ],
  })
);

app.use(bodyParser.json());
app.use(logger);
app.use(route);

export default app;

// app.listen(PORT, () => {
//   console.log("You're listening to port", PORT);
// });
