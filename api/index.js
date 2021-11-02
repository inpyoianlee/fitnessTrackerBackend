// create an api router
const apiRouter = require("express").Router();
const { JWT_SECRET } = process.env;
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

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

apiRouter.get("/health", (req, res, next) => {
  res.send({ message: "It works" });
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter );

const routine_activitiesRouter = require('./routine_activities');
apiRouter.use('/routine_activities', routine_activitiesRouter );

module.exports = apiRouter;
