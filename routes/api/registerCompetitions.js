const express = require("express");
const router = express.Router();
const Competition = require("../../models/Competitions");
const User = require("../../models/users");
const configPg = require("../../config/config").createConfig;
const pgtools = require("pgtools");

router.post("/register", function(req, res) {
    Competition.findOne({ competitionName : req.body.competitionName}).then((competition) => {
        if(!competition){
            return res.status(404).send("Competition does not exist");
        }
        // can check date for expired competition
        else {
            User.findOne({ studentId : req.body.studentID}).then((user) => {
                if(!user) {
                    return res.status(404).send("User not found");
                } else {
                    const participants = competition.participantsIds;
                    participants.push(req.body.userID);
                    competition
                      .updateOne({}, { participantsIds: participants })
                      .then((resp) => {
                          const competitions = user.competitions;
                          competitions.push(req.body.competitionName);
                          user.updateOne({}, { competitions: competitions }).then((response) => {
                              return res.status(200).send("User registered for competition");
                          }).catch((err) => {
                              return res.status(500).send(err.message);
                          });
                      }).catch((err) => {
                          return res.status(500).send(err.message);
                      });
                }
            });
        }
    });
})

module.exports = router;


