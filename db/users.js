const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows: [user] } = await client.query(
      `
          INSERT INTO users (username, password)
          VALUES ($1, $2)
          RETURNING *;
            `,
      [username, hashedPassword]
    );
    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getUserById(id) {
  try {
    const { rows: [user] } = await client.query(`
        SELECT * FROM users WHERE id=${id};
    `);
    return user;
  } catch (err) {
    throw err;
  }
}

async function getUserByUserName(username) {
  try {
    const { rows: [user] } = await client.query(`
        SELECT * FROM users WHERE username=$1;
    `, [username]);
    return user;
  } catch (err) {
    throw err;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUserName(username);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordsMatch) {
      delete user.password;
      return user;
    } else {
      return null;
      // not sure about this one, if I try to throw an Error, it does not pass the test.
    }
  } catch (err) {
    throw err;
  }
}

module.exports = { createUser, getUser, getUserById };
