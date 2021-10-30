const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities } = require('../db')

activitiesRouter.get('/', async (req, res) => {
    const allActivities = await getAllActivities();

    res.send({
        allActivities
    });
})


module.exports = activitiesRouter;