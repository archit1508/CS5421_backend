const express = require("express");
const router = express.Router();
const sql = require("../../services/sql-query-service");
const Competition = require("../../models/Competitions");
const pgtools = require("pgtools");
const { Pool } = require("pg");
const configPg = require("../../config/config").createConfig;

router.post("/runQueries", function (req, res) {
  // if (!req.body.competitionName || !req.body.query) {
  //   return res.status(400);
  // }
  // const credentials = {
  //   ...configPg,
  //   database: req.body.competitionName,
  // };
  // const pool = new Pool(credentials);
  // pool
  //   .query(req.body.query)
  //   .then((err, response) => {
  //     pool.end().then(() => {
  //       if (err) {
  //         return res.json(err.message);
  //       }
  //       return res.json(response);
  //     });
  //   })
  //   .catch((err) => {
  //     return res.status(400).send(err.message);
  //   });
  Competition.findOne({ competitionName: req.body.competitionName }).then(
    (competition) => {
      if (!competition) {
        return res.status(404).send("Competition not found");
      } else {
        const DBServerConfig = {
          ...configPg,
          database: req.body.competitionName,
        };
        sql
          .query(DBServerConfig, req.body.query)
          .then((response) => {
            const queries = competition.creationQueries;
            queries.push(req.body.query);
            competition
              .updateOne({}, { creationQueries: queries })
              .then((response) => {
                return res.status(200).send("Query executed successfully");
              })
              .catch((err) => {
                return res.status(500).send(err.message);
              });
          })
          .catch((err) => {
            return res.status(404).send(err.message);
          });
      }
    }
  );
});

module.exports = router;
