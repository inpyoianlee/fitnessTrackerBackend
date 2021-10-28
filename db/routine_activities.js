const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    // console.log("HELOOOOO", routineId,
    // activityId,
    // count,
    // duration,);
    const {
      rows: [routine_activity],
    } = await client.query(
      `
            INSERT INTO routine_activities ("routineId", "activityId", count, duration)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT ("routineId", "activityId") DO NOTHING
            RETURNING *;
        `,
      [routineId, activityId, count, duration]
    );
    
    return routine_activity;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  addActivityToRoutine,
};
