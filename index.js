// create the express server here
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const server = express();
const morgan = require("morgan");
server.use(morgan("dev"));
const cors = require("cors");
server.use(cors());
server.use(express.json());
const apiRouter = require("./api");
server.use("/api", apiRouter);
const client = require("./db/client");

server.use((req, res, next) => {
  console.log("404: Page not found");
  res.status(404).send("Request failed with status code 404");
});

server.use((err, req, res, next) => {
  console.log("500: Internal Server Error");
  res.status(500).send({ error: err.message });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  client.connect();
});
