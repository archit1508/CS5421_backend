const sql = require('../services/sql-query-service')
const config = require('../config/config').defultConfig



// TODO: Validate SQL query from Student
const isValid = query => {
    console.log(query)
    return query.length
}

// tables, max execution time, 
// database: name, configuration, correct answers
var getCompetitionDetails = async function (competitionId){

        // TODO: Get competition SQL config from MongoDB
    // var CompetitionConfig = ...

    var CompetitionConfig = {
        user: 'postgres',
        host: 'localhost',
        database: 'Tutorial',
        password: '******',
        port: 5432,
    }

    

    return {
        Id: '1',
        Name: 'test',
        Description: 'competitionDescription',
        databases:[
            database:{

            }
        ]


    }

}


var isQueryCorrect = async function (query, databaseDetails){
    const answer = databaseDetails.answer



}

var checkExecutionTime = async function (query, databaseDetails){



}


var resetSQL = async function (req,res){



}




var executeQuery = async function (query, databaseConfig, maxTime){



  
    // use defult setting in config file if no config find for competition
    const SQLConfig = CompetitionConfig ? CompetitionConfig : config

    // Send Query to SQL DB
    if (isValid(query)){
        sql.query(SQLConfig, query)
        .then(results => {
          res.status(200).json(results.rows)
        })
      }


}

var updateMongoDBQueryInfo = async function (queryId, details){



}

var getDatabaseConfig = async function (id){

}


var receiveQuery = async function(req,res){
    const competitionId = req.params.competitionid
    const query = req.query.q;
    console.log(competitionId, query)
    
    const queryId = createQueryInMongoDB(query, competitionId)

    // competitionDetails = getCompetitionDetails(competitionId)
    // databases = competitionDetails.databases

    // for (database in databases) {
    //     databaseDetails = getDatabaseDetails(database)
    //     const isQueryCorrect = checkQueryCorrectness(query, databaseDetails)
    //     updateMongoDBQueryInfo(queryId, {"correctness": isQueryCorrect})
    //     if (isQueryCorrect){
    //         var executionTime = checkExecutionTime(query, databaseDetails)
    //         updateMongoDBQueryInfo(queryId, {"executionTime": executionTime})
    //         resetSQL(databaseDetails)
    //     }
    // }


      
}


module.exports.receiveQuery = receiveQuery;
