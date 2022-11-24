require('dotenv').config()
const express = require("express");
const cors = require("cors");
const client = require("./db");

const app = express();

// middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(express.static('build'))

// CONNECT TO POSTGRESQL DATABASE
client.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log("connected to database");
  });
});


//------ROUTES-------//

// POST REVIEWS
app.post("/reviews", (req, res) => {
  const id = Math.floor(Math.random() * 1000000); // id generated by backend rather than frontend
  const { student_id, review, course_id, likes, dislikes, difficulty, workload, teaching } = req.body;
  client.query(
    "INSERT INTO reviews (id, student_id, review, course_id, likes, dislikes, difficulty, workload, teaching) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
    [id, student_id, review, course_id, likes, dislikes, difficulty, workload, teaching],
    (err, result) => {
      if (!err) {
        res.json(result.rows[0]);
        console.log("Successfully added data");
      } else {
        console.log(err.message);
      }
      client.end;
    }
  );
});

// GET REVIEWS
app.get("/reviews", (req, res) => {
  client.query("SELECT * FROM reviews", (err, result) => {
    if (!err) {
      const resultRows = result.rows;
      res.json(resultRows);
      console.log("Successfully fetched data");
    } else {
      console.log(err.message);
    }
    client.end;
  });
});

// GET SPECIFIC COURSE REVIEWS
app.get("/reviews/:id", (req, res) => {
  const { id } = req.params;
  client.query(
    "SELECT * FROM reviews WHERE course_id = $1",
    [id],
    (err, result) => {
      if (!err) {
        res.json(result.rows);
        console.log("Successfully fetched data");
      } else {
        console.log(err.message);
      }
      client.end;
    }
  );
});

// UPDATE REVIEW (likes, dislikes, new text) now this handles them all
app.put("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const { student_id, review, course_id, likes, dislikes, difficulty, workload, teaching } = req.body;
  client.query(
    "UPDATE reviews SET student_id=$2, review=$3, course_id=$4, likes=$5, dislikes=$6, difficulty=$7, workload=$8, teaching=$9 WHERE id=$1 RETURNING *",
    [id, student_id, review, course_id, likes, dislikes, difficulty, workload, teaching],
    (err, result) => {
      if (!err) {
        res.json(result.rows[0]);
        console.log("Successfully updated review");
      } else {
        console.log(err.message);
      }
    }
  );
});

// DELETE REVIEW
app.delete("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const deleteReview = client.query(
    "DELETE FROM reviews WHERE id = $1",
    [id],
    (err, response) => {
      if (!err) {
        res.json("Review was deleted");
        console.log("Successfully deleted review");
      } else {
        console.log(err.message);
      }
      client.end;
    }
  );
});

// GET VERIFIED USERS
app.get("/verified", (req, res) => {
  client.query("SELECT * FROM verified_ids", (err, result) => {
    if (!err) {
      const resultRows = result.rows;
      res.json(resultRows);
      console.log("Successfully fetched data");
    } else {
      console.log(err.message);
    }
    client.end;
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
