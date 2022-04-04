const express = require("express");
const router = express.Router();
const pgtools = require("pgtools");
const { Pool } = require("pg");
const configPg = require("../../config/config").createConfig;

router.post("/runQueries", function (req, res) {
  if (!req.body.competitionName || !req.body.query) {
    return res.status(400);
  }
  console.log(req.body.query);
  const credentials = {
    ...configPg,
    database: req.body.competitionName,
  };
  const pool = new Pool(credentials);
  pool
    .query(req.body.query)
    .then((err, response) => {
      pool.end().then(() => {
        if (err) {
          return res.json(err.message);
        }
        return res.json(response);
      });
    })
    .catch((err) => {
      return res.status(400).send(err.message);
    });
});

module.exports = router;
