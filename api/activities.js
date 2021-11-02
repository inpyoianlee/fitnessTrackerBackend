const express = require("express");
const activitiesRouter = express.Router();
const { 
    getAllActivities, 
    createActivity, 
    getPublicRoutinesByActivity, 
    updateActivity 
} = require('../db')
const { requireUser } = require('./utils')

activitiesRouter.get('/', async (req, res, next) => {
    try {
        const allActivities = await getAllActivities();

        res.send(allActivities);
    } catch (err) {
        next(err);
    }

})

activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, description } = req.body;

    try {
        const activity = await createActivity({ name, description });

        res.send(activity);
    } catch ({ name, description }) {
        next({ name, description });
    }
})

activitiesRouter.patch('/:activityId', async (req, res, next) => {
    const { name, description } = req.body;
    const id = req.params.activityId;
    try {
        const updatedActivity = await updateActivity({ id, name, description });
        res.send(updatedActivity);
    } catch ( { name, description } ) {
        next({name, description});
    }
})

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const id = req.params.activityId;
    try {
        const routines = await getPublicRoutinesByActivity({ id });
        res.send(routines);
    } catch(err) {
        next(err);
    }
})

module.exports = activitiesRouter;