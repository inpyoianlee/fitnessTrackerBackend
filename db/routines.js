const client = require("../db/client");

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
        const result = await client.query(`SELECT * FROM routines;`);
        

module.exports = {getRoutineById,getRoutinesWithoutActivities, getAllRoutines, };
