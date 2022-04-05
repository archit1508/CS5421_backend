const express = require("express");
const router = express.Router();
const Competition = require("../../models/Competitions");
const sql = require("../../services/sql-query-service");

router.post("/questions", function (req, res) {
  Competition.findOne({ competitionName: req.body.competitionName })
    .then((competition) => {
      if (!competition) {
        return res.status(404).send("Competition not found");
      } else {
        const DBServerConfig = {
          ...configPg,
          database: req.body.competitionName,
        };
        sql
          .getCorrectAnswer(req.body.query)
          .then((response) => {
            competition
              .updateOne(
                {},
                {
                  question: req.body.questions,
                  correctQuery: req.body.query,
                  correctAnswer: response.result,
                }
              )
              .then((response) => {
                return res.status(200).send("Question added successfully");
              })
              .catch((err) => {
                return res.status(500).send(err.message);
              });
          })
          .catch((err) => {
            return res.status(400).send(err.message);
          });
      }
    })
    .catch((err) => {
      return res.status(500).send(err.message);
    });
});

module.exports = router;