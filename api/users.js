// create an api router
const apiRouter = require('express').Router();
const {createUser} = require('../db/users')

apiRouter.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const user = await createUser(username, password);
    res.send(user);
});


module.exports = apiRouter;
