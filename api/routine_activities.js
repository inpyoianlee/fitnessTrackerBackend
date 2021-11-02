const express = require("express");
const routine_activitiesRouter = express.Router();
const { requireUser } = require('./utils')
const {
    updateRoutineActivity, 
    getRoutineById, 
    destroyRoutineActivity 
} = require('../db');

routine_activitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const routineActivityId = req.params.routineActivityId;
    const { count, duration } = req.body;
    try {
        const routineActivity = await updateRoutineActivity({ id:routineActivityId, count, duration });
        const routine = await getRoutineById( routineActivity.routineId );
        if (routine.creatorId === req.user.id) {
            res.send(routineActivity)
        } else {
            next({
                message: "Cannot modify a routine activity thats not yours!"
            })
        }
    } catch ({ routineId, activityId, count, duration }) {
        next({ routineId, activityId, count, duration });
    }
})

routine_activitiesRouter.delete("/:routineActivityId", requireUser, async (req, res, next) => {
    const routineActivityId = req.params.routineActivityId;
    try {
        const destroyedRoutine = await destroyRoutineActivity(routineActivityId);
        const routineCheck = await getRoutineById( destroyedRoutine.routineId );
        if ( routineCheck.creatorId === req.user.id ) {
            res.send(destroyedRoutine);
        } else {
            next({
                message: "Error: can't delete a routine activity thats not yours"
            })
        }
    } catch (err) {
        next(err);
    }
})

module.exports = routine_activitiesRouter;