const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    db.on("trace", (data) => {
      console.log({ data });
    });
    app.listen(3000, (e) => {
      console.log(`Server Running at http://localhost:3000/`, { e });
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
    *
    FROM
    cricketTeam`;
  const cricket = await db.all(getPlayersQuery);
  response.send(cricket);
});

//API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO
  cricketTeam (playerName,jerseyNumber,role)
  VALUES
  (
      '${playerName}',
      '${jerseyNumber}',
      '${role}');`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playersId/", async (request, response) => {
  const { playersId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricketTeam
    WHERE
      playerId = ${playersId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API 4
app.put("/players/:playersId/", async (request, response) => {
  const { playersId } = request.params;
  const playersDetails = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;
  const updatePlayerQuery = `
    UPDATE
      cricketTeam
    SET
      playerName='${playerName}',
      jerseyNumber=${jerseyNumber},
      role=${role},
    WHERE
      playersId = ${playersId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API5
app.delete("/players/:playersId/", async (request, response) => {
  const { playersId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      book
    WHERE
      playersId = ${playersId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app();
