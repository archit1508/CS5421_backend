const express = require("express");
const router = express.Router();
const { fork } = require('child_process');

const submissionController = require('../../controllers/submission-controller.js');
const processMap = new Map();

var createExecutionThread = async function(req,res){

    const creatorId = req.params.id
    const competitionName = req.query.competition
    const query = req.query.q;

    const info = {
        "creatorId": creatorId,
        "competitionName": competitionName,
        "query": query
    }

    const child = fork('./controllers/submission-controller.js');
    child.send({ info: info });
    processMap.set(req.params.id, child.pid)
    child.on('message', async (result) => {
        console.log("createExecutionThread res", result)
        processMap.delete(result);
        res.sendStatus(200)
    });
}


// Input parameter: competition Id 
// Input query: q, competition(name)
// router.post("/submit/:id", createExecutionThread);
router.post("/submit/:id", submissionController.runQuery);




module.exports = router;