const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

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
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
    *
    FROM
    moviesData`;
  const movies = await db.all(getMoviesQuery);
  response.send(movies);
});

//API 2
app.post("/players/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const getMoviesQuery = `
  INSERT INTO
  moviesData (directorId, movieName, leadActor)
  VALUES
  (
      '${directorId}',
      '${movieName}',
      '${leadActor}');`;
  const dbResponse = await db.run(getMoviesQuery);
  response.send("Movie Successfully Added");
});

//API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMoviesQuery = `
    SELECT
      *
    FROM
      moviesData
    WHERE
      movieId = ${movieId};`;
  const movies = await db.get(getMoviesQuery);
  response.send(movies);
});

//API 4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMoviesQuery = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE
      moviesData
    SET
      directorId='${directorId}',
      movieName=${movieName},
      leadActor=${leadActor},
    WHERE
      movieId = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//API5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM
      moviesData
    WHERE
      movieId = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

module.exports = app;
