const express = require("express");
const router = express.Router();

var submissionController = require('../../controllers/submission-controller.js');




// Input parameter: competition Id 
// Input query: q, competition(name)
router.post("/submit/:id", submissionController.receiveQuery);




module.exports = router;