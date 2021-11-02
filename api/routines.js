const express = require("express");
const routinesRouter = express.Router();
const { requireUser } = require("./utils")
const { 
    createRoutine, 
    updateRoutine, 
    destroyRoutine, 
    addActivityToRoutine 
} = require('../db')
const {
    getAllPublicRoutines, 
} = require('../db')

routinesRouter.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines()
        res.send( routines );
    } catch(err) {
        next(err);
    }
});

routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, goal } = req.body;
    let { isPublic } = req.body;
    const creatorId = req.user.id;

    if (isPublic === null) {
        isPublic = false;
    }

    try {
        const routine = await createRoutine({ creatorId, name, goal, isPublic });
        res.send(routine);
    } catch ({ name, goal, isPublic }) {
        next({ name, goal, isPublic })
    }
})

routinesRouter.patch('/:routineId', async (req, res, next) => {
    const routineId = req.params.routineId;
    const { name, goal } = req.body;
    let { isPublic } = req.body;
    if (isPublic === null) {
        isPublic = false;
    }
    try {
        const routine = await updateRoutine({ id: routineId, isPublic, name, goal });
        res.send(routine);
    } catch({ isPublic, name, goal }) {
        next({ isPublic, name, goal })
    }
})

routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    const routineId = req.params.routineId;
    try {
        const routine = await destroyRoutine(routineId);

        res.send(routine);
    } catch (err) {
        next(err);
    }
})

routinesRouter.post('/:routineId/activities', requireUser, async (req, res, next) => {
    const routineId = req.params.routineId;
    const { activityId, count, duration } = req.body;
    try {
        const routineActivity = await addActivityToRoutine({ routineId, activityId, count, duration });
        if (routineActivity) {
            res.send(routineActivity);
        } else {
            next({
                message: "Error, duplicate routineId activityId pair"
            });
        }
    } catch({routineId, activityId, count, duration }) {
        next({routineId, activityId, count, duration });
    }

})

module.exports = routinesRouter;