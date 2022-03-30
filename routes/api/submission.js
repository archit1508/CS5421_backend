const express = require("express");
const router = express.Router();

var submissionController = require('../../controllers/submission-controller.js');




// Input parameter: competition Id 
// Input query: q
router.get("/submit/:competitionid", submissionController.receiveQuery);




module.exports = router;