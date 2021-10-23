const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows } = await client.query(
      `
          INSERT INTO users (username, password)
          VALUES ($1, $2)
          RETURNING *;
            `,
      [username, hashedPassword]
    );
    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;

  const passwordsMatch = bcrypt.compare(password, hashedPassword);
  if (passwordsMatch) {
    delete user.password;
    return user;
  } else {
    throw SomeError;
  }
}

module.exports = { createUser, getUser };
