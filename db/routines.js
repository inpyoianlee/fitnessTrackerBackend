const client = require("../db/client");
const { attachActivitiesToRoutines } = require('./activities.js');

async function getRoutineById(id) {
    try {
        const result = await client.query(`SELECT * FROM routines WHERE id = $1;`, [id]);
        return result.rows[0];
    }
    catch (err) {
        console.log(err);
    }
}

async function getRoutinesWithoutActivities() {
    try {
        const result = await client.query(`SELECT * FROM routines;`);
        return result.rows;
    }
    catch (err) {
        console.log(err);
    }
}

async function getAllRoutines() {
    try {
        const {rows: routines } = await client.query(`
            SELECT routines.*, users.username as "creatorName" 
            FROM routines
            JOIN users ON users.id=routines."creatorId";
        `);
        const results = await attachActivitiesToRoutines(routines);
        return results;
    } catch (err) {
        throw err;
    }
} 

async function createRoutine({ creatorId, isPublic, name, goal }) {
    try {
        const {rows: [routine]} = await client.query(`
            INSERT INTO routines ("creatorId", "isPublic", name, goal)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, isPublic, name, goal])

        return routine;
    } catch (err) {
        throw err;
    }
}

async function getAllPublicRoutines() {
    try {
        const {rows: routines} = await client.query(`
            SELECT r.*, u.username as "creatorName"
            FROM routines r
            JOIN users u ON u.id=r."creatorId"
            WHERE "isPublic"=true;
        `)

        const newRoutines = await attachActivitiesToRoutines(routines);

        return newRoutines;
    } catch(err) {
        throw err;
    }
}

async function getPublicRoutinesByUser({ username }) {
    try {
        const {rows: routines} = await client.query(`
            SELECT r.*, u.username as "creatorName"
            FROM routines r
            JOIN users u ON u.id=r."creatorId"
            WHERE "isPublic"=true AND u.username=$1;
        `, [username])

        const results = await attachActivitiesToRoutines(routines);

        return results;
    } catch (err) {
        throw err;
    }
}

async function getAllRoutinesByUser({username}) {
    try {
        const {rows: routines} = await client.query(`
            SELECT r.*, u.username as "creatorName"
            FROM routines r
            JOIN users u ON u.id=r."creatorId"
            WHERE u.username=$1;
        `, [username])

        const results = await attachActivitiesToRoutines(routines);
        return results;
    } catch (err) {
        throw err;
    }
}

async function getPublicRoutinesByActivity({ id }) {
    try {
        const {rows: routines} = await client.query(`
            SELECT r.*, u.username as "creatorName", ra."activityId" as "activityId"
            FROM routines r
            JOIN users u ON u.id=r."creatorId"
            JOIN routine_activities ra ON ra."routineId"=r.id
            WHERE ra."activityId"=$1;
        `, [id])

        const results = await attachActivitiesToRoutines(routines);
        return results;
    } catch(err) {
        throw err;
    }
}

async function updateRoutine({ id, isPublic, name, goal }) {
    const queryList = [];
    const secondParam = [];
    if (isPublic) {
        queryList.push('"isPublic"=$')
        secondParam.push(isPublic)
    }

    if (name) {
        queryList.push('name=$')
        secondParam.push(name)
    }

    if (goal) {
        queryList.push('goal=$')
        secondParam.push(goal)
    }

    const queryString = queryList.map((field, index) => {
        return `${ field }${ index + 2 }`;
    }).join(', ')

    try {
        const {rows: [routine]} = await client.query(`
            UPDATE routines
            SET ${ queryString }
            WHERE id=$1
            RETURNING *;
        `, [id, ...secondParam]);

        return routine;
    } catch (err) {
        throw err;
    }
}

async function destroyRoutine(id) {
    try {

        await client.query(`
            DELETE FROM routine_activities
            WHERE "routineId"=$1;
        `, [id]);
        await client.query(`
            DELETE FROM routines
            WHERE id=$1;
        `, [id])

    } catch (err) {
        throw err;
    }
}

module.exports = {
    getRoutineById,
    getRoutinesWithoutActivities, 
    getAllRoutines, 
    createRoutine, 
    getAllPublicRoutines, 
    getPublicRoutinesByUser, 
    getAllRoutinesByUser, 
    getPublicRoutinesByActivity, 
    updateRoutine, 
    destroyRoutine
};
