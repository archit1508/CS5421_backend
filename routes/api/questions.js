const express = require("express");
const router = express.Router();
const Competition = require("../../models/Competitions");
const submissionController = require("../../controllers/submission-controller");
const configPg = require("../../config/config").createConfig;

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
        submissionController
          .getCorrectAnswer(req.body.query, DBServerConfig)
          .then((response) => {
            console.log(response);
            Competition.findOneAndUpdate(
              { competitionName: req.body.competitionName },
              {
                question: req.body.questions,
                correctQuery: req.body.query,
                correctAnswer: response,
              }
            )
              .then(() => {
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
