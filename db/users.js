const client = require('./client');

async function createUser({username, password}) {
    const SALT_COUNT = 10;

    bcrypt.hash(password, SALT_COUNT, function(err, hashedPassword) {
        createUser({
            username,
            password: hashedPassword // not the plaintext
        });
    });
}

// inside of createUser({ username, password})

// // inside of getUser({username, password})
// const user = await getUserByUserName(username);
// const hashedPassword = user.password;

// bcrypt.compare(password, hashedPassword, function(err, passwordsMatch) {
//   if (passwordsMatch) {
//     // return the user object (without the password)
//   } else {
//     throw SomeError;
//   }
// });