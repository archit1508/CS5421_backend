const express = require("express");
const router = express.Router();
const sql = require('../../services/sql-query-service')
const config = require('../../config/config').defultConfig

// TODO: Validate SQL query from Student
const isValid = query => {
  console.log(query)
  return query.length
}


// Input parameter: competition Id 
// Input query: q
router.get("/submit/:competitionid", async function(req,res){
    const competition = req.params.competitionid
    const query = req.query.q;
    console.log(competition, query)

    // TODO: Get competition SQL config from MongoDB
    // var CompetitionConfig = ...
    var CompetitionConfig = {
      user: 'postgres',
      host: 'localhost',
      database: 'Tutorial',
      password: '******',
      port: 5432,
    }

    // use defult setting in config file if no config find for competition
    const SQLConfig = CompetitionConfig ? CompetitionConfig : config

    // Send Query to SQL DB
    if (isValid(query)){
      sql.query(SQLConfig, query)
      .then(results => {
        res.status(200).json(results.rows)
      })
    }
      
});


module.exports = router;