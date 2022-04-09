const express = require("express");
const router = express.Router();
const Competition = require("../../models/Competitions");

router.get('/getCompetitionsAll', function(req,res){
    Competition.find({}).then(foundEvents =>{
        if(foundEvents){
            console.log(foundEvents)
            let eventArr = []
            foundEvents.forEach((event)=>{
                eventArr.push({
                    id: event._id,
                    title: event.competitionName,
                    description: event.competitionDescription,
                    startDate: event.competitionStartDate,
                    endDate: event.competitionEndDate
                    })
            })
            return res.status(200).json({eventArr})
        }
        else{
            return res.status(400)
        }
    })
})

module.exports = router;