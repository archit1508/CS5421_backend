const express = require("express");
const router = express.Router();
const Competition = require("../../models/Competitions");
const User = require("../../models/users");
const configPg = require("../../config/config").createConfig;
const pgtools = require("pgtools");

router.post("/register", function (req, res) {
  Competition.findOne({ competitionName: req.body.competitionName }).then(
    (competition) => {
      if (!competition) {
        return res.status(404).send("Competition does not exist");
      }
      // can check date for expired competition
      else {
        User.findOne({ email: req.body.emailID }).then((user) => {
          if (!user) {
            return res.status(404).send("User not found");
          } else {
            const participants = competition.participantsIds;
            if (isAlreadyregistered(participants, req.body.emailID)) {
              return res.status(404).send("User already registered");
            } else {
              participants.push(req.body.emailID);
              Competition.findOneAndUpdate(
                { competitionName: req.body.competitionName },
                { participantsIds: participants }
              )
                .then(() => {
                  const competitions = user.competitionId;
                  competitions.push(req.body.competitionName);
                  User.findOneAndUpdate(
                    { email: req.body.emailID },
                    { competitionId: competitions }
                  )
                    .then(() => {
                      return res
                        .status(200)
                        .send("User registered for competition");
                    })
                    .catch((err) => {
                      return res.status(500).send(err.message);
                    });
                })
                .catch((err) => {
                  return res.status(500).send(err.message);
                });
            }
          }
        });
      }
    }
  );
});
const isAlreadyregistered = (participants, userID) => {
  for(const id of participants){
    if(userID === id){
      return true;
    }
  }
  return false;
}

module.exports = router;
