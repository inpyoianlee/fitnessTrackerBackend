// create an api router
const apiRouter = require('express').Router();

apiRouter.get('/health', (req, res, next) => {
    res.send({message:"It works"})
})
// attach other routers from files in this api directory (users, activities...)
// export the api router
apiRouter.use("/users", require("./users"))

module.exports = apiRouter;
