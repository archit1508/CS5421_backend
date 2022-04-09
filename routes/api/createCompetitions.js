const express = require("express");
const router = express.Router();
const Competition = require("../../models/Competitions");
const configPg = require('../../config/config').createConfig;
const pgtools = require('pgtools');


router.post("/ce", function(req,res){
    Competition.findOne({competitionName: req.body.competitionName}).then(ce => {
        if(ce){
            return res.status(400)
        }
        else{
            const newEvent = new Competition({
              creatorId: req.body.creatorId,
              competitionName: req.body.competitionName,
              competitionDescription: req.body.competitionDescription,
              competitionStartDate: req.body.competitionStartDate,
              competitionEndDate: req.body.competitionEndDate,
              question: "",
              correctQuery: "",
              correctAnswer: "",
              statementTimeout: 2000,
              creationQueries: "",
              competitionSubmissions: [],
              participantsIds: [],
            });
            newEvent.save()
            .then(ev => {
                res.json(ev)
                pgtools.createdb(configPg, req.body.competitionName, function(err,res){
                    if (err) {
                        console.error(err);
                    }
                    console.log(res);
                })
            })
            .catch(err=>console.log(err));
        }
    });
});

module.exports = router;
