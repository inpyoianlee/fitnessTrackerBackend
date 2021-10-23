   // build and export your unconnected client here

const { Client } = require('pg');

const client = new Client("not connected yet :O");

module.exports = client;