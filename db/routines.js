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

module.exports = {getRoutineById,getRoutinesWithoutActivities, getAllRoutines, createRoutine };
