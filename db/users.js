const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  bcrypt.hash(password, SALT_COUNT, function (err, hashedPassword) {
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
  });
}

async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;

  bcrypt.compare(password, hashedPassword, function (err, passwordsMatch) {
    if (passwordsMatch) {
      delete user.password;
      return user;
    } else {
      throw SomeError;
    }
  });
}

module.exports = { createUser, getUser };
