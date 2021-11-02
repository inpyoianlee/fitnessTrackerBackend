// create an api router
const express = require("express");
const usersRouter = express.Router();
const { createUser, getUserByUserName, getUser, getUserById } = require("../db/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getPublicRoutinesByActivity, getPublicRoutinesByUser } = require("../db");
//REGISTER
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUserName(username);
    if (_user) {
      next({
        name: "UserAlreadyExistsError",
        message: "User already exists",
      });
    } else if (password.length < 8) {
      next({
        message: "password too short",
      });
    } else if (!_user) {
      const user = await createUser({ username, password });
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({
        message: "thank you for signing up",
        token,
        user,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
//LOGIN
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401)
      next({name: "NotLoggedIN", message: "you must be logged in"})
    } else {
      res.send(req.user);
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/:username/routines", async (req, res, next) => {
  const username = req.params.username;

  try {
    const user = await getUserByUserName( username )
    if (!user){
      return res.send({message: "error finding username"})
    }
    const routines = await getPublicRoutinesByUser({id: user.id, username});
    res.send(routines)
  } catch (error) {
    next(error)
  }
});
module.exports = usersRouter;