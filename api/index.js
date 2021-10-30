// create an api router
const apiRouter = require("express").Router();
const { JWT_SECRET } = process.env;
apiRouter.get("/health", (req, res, next) => {
  res.send({ message: "It works" });
});
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");

// attach other routers from files in this api directory (users, activities...)
// export the api router

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);

      const id = parsedToken && parsedToken.id;
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
