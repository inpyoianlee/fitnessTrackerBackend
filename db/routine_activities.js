const client = require('./client');

async function getRoutineActivityById(id) {
    try {
        const {rows:[routineActivity]} = await client.query(`
            SELECT * FROM routine_activities WHERE id=$1;
        `, [id]);

        return routineActivity
    } catch (err) {
        throw err;
    }
}

async function addActivityToRoutine ({ routineId, activityId, count, duration }) {
    try {
        const {rows: [routine_activity]} = await client.query(`
            INSERT INTO routine_activities ("routineId", "activityId", count, duration)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT ("routineId", "activityId") DO NOTHING
            RETURNING *;
        `, [routineId, activityId, count, duration])
        return routine_activity;
    } catch (err) {
        throw err;
    }
}

async function updateRoutineActivity({id, count, duration}) {
    try {
        const {rows: [routineActivity]} = await client.query(`
            UPDATE routine_activities
            SET count=$1, duration=$2
            WHERE id=$3
            RETURNING *;
        `, [count, duration, id])

        return routineActivity;
    } catch (err) {
        throw err;
    }
}

async function destroyRoutineActivity(id) {
    try {
        const {rows: [routine]} = await client.query(`
            DELETE FROM routine_activities
            WHERE id=$1
            RETURNING *;
        `, [id]);

        return routine;
    } catch (err) {
        throw err;
    }
}

async function getRoutineActivitiesByRoutine({ id }) {
    try {
        const {rows: routines} = await client.query(`
            SELECT * FROM routine_activities WHERE "routineId"=$1;
        `, [id]);

        return routines;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getRoutineActivityById, 
    addActivityToRoutine, 
    updateRoutineActivity, 
    destroyRoutineActivity, 
    getRoutineActivitiesByRoutine
}