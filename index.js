// create the express server here
// Use the dotenv package, to create environment variables
require('dotenv').config()

// Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000
const PORT = process.env.PORT || 3000;

// Import express, and create a server
const express = require('express');
const server = express();

// Require morgan and body-parser middleware
const morgan = require('morgan');
server.use(express.json());

// Have the server use morgan with setting 'dev'
server.use(morgan('dev'));

// Import cors 
const cors = require('cors');
// Have the server use cors()
server.use(cors());
// Have the server use bodyParser.json()

// Have the server use your api router with prefix '/api'
const apiRouter = require('./api')
server.use('/api', apiRouter);

// Import the client from your db/client.js
const { client } = require('./db/client');
console.log(client);

server.get('/api', (req, res, next) => {
    console.log("A get request was made to /api");
    res.send({ message: "success" });
});

server.use('/api', (req, res, next) => {
    console.log("A request was made to /api");
    next();
});

// Create custom 404 handler that sets the status code to 404.
server.use(function (req, res, next) {
    console.log("in 404 error handler");
    res.status(404);
    res.send("Unable to find the requested resource!");

})

// Create custom error handling that sets the status code to 500
// and returns the error as an object
server.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send({ error: err.message });

})

// Start the server listening on port PORT
// On success, connect to the database

server.listen(PORT, () => {
    console.log("server started!")
    client.connect();
})