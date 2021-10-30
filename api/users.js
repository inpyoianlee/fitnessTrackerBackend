// create an api router
const express = require("express");
const usersRouter = express.Router();
const { createUser, getUserByUserName } = require("../db/users");
const jwt = require("jsonwebtoken");

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUserName(username);
    console.log(_user, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    if (_user) {
      next({
        name: "UserAlreadyExistsError",
        message: "User already exists",
      });
    } else if(password.length < 8){
        next({
            message: "password too short",
        })
    } 
    
    else if(!_user){ const user = await createUser({ username, password });

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
    });}
  
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
