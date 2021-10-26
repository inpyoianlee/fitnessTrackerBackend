const client = require("./client");

// const {
//     getAllActivities,
//     } = require('../db/activities');

async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(
      `SELECT * FROM activities;`
    );

    return activities;
  } catch (err) {
    next(err);
  }
}

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `INSERT INTO activities (name, description)
            VALUES ($1, $2)
            RETURNING *;`,
      [name, description]
    );

    return activity;
  } catch (err) {
    next(err);
  }
}

async function updateActivity({ id, name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `UPDATE activities
            SET name = $1, description = $2
            WHERE id = $3
            RETURNING *;`,
      [name, description, id]
    );

    return activity;
  } catch (err) {
    next(err);
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(
      `SELECT * FROM activities
            WHERE id = $1;`,
      [id]
    );

    return activity;
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllActivities, createActivity, updateActivity, getActivityById };
