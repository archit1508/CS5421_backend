const sql = require('../services/sql-query-service')
const config = require('../config/config').defultConfig
const Submission = require("../models/Submissions");
const Competition = require("../models/Competitions");
ObjectID = require('mongodb').ObjectId;


// TODO: Validate SQL query from Student
const isValid = query => {
    console.log(query)
    return query.length
}


var getCompetitionDetails = async function (competitionName){

    // TODO: Get competition SQL config from MongoDB
    // TODO: Error handling, if cannot find competition provided
    return new Promise((resolve, reject) => {

        var competition = 
        {
            creatorId: "creatorId",
            competitionName: "competitionName", 
            competitionDescription : "competitionDescription",
            competitionStartDate: "competitionStartDate",
            competitionEndDate: "competitionEndDate",
            competitionSubmissions : [],
            participantsIds:[],
            DBServerConfig:{
                database: 'Tutorial', // same as competition name
                tables: ['table1', 'table2'],
                correctAnswer: `{"result": [
                    {
                        "w_id": 301,
                        "i_id": 1,
                        "s_qty": 338
                    },
                    {
                        "w_id": 301,
                        "i_id": 4,
                        "s_qty": 938
                    },
                    {
                        "w_id": 301,
                        "i_id": 5,
                        "s_qty": 760
                    },
                    {
                        "w_id": 301,
                        "i_id": 8,
                        "s_qty": 924
                    },
                    {
                        "w_id": 301,
                        "i_id": 12,
                        "s_qty": 454
                    },
                    {
                        "w_id": 301,
                        "i_id": 13,
                        "s_qty": 768
                    },
                    {
                        "w_id": 301,
                        "i_id": 21,
                        "s_qty": 355
                    },
                    {
                        "w_id": 301,
                        "i_id": 22,
                        "s_qty": 23
                    },
                    {
                        "w_id": 301,
                        "i_id": 31,
                        "s_qty": 700
                    },
                    {
                        "w_id": 301,
                        "i_id": 36,
                        "s_qty": 158
                    }
                ]}`,
                user: 'postgres',
                host: 'localhost',
                password: '1234567',
                port: 5432,
                statement_timeout: 10000 //milliseconds
            }

        }

        resolve (competition)

    });



}

// Sort a list of objects based on one property
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

// Dynamically sort a list of objects based on multiple properties
function dynamicSortMultiple() {

    var props = arguments;
    console.log('props', props)
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

// Check whether two query results (list of objects) are equal
var isQueryResultEqual = async function (a, b){
    
    if (a.length != b.length) return false // different number of columns
    if (a.length == 0) return true // both empty result

    aKeys = Object.keys(a[0])
    bKeys = Object.keys(b[0])
    aKeys.sort()
    bKeys.sort()

    if (JSON.stringify(aKeys) !== JSON.stringify(bKeys)) return false // different column names
    
    aSorted = a.sort(dynamicSortMultiple.apply(this, aKeys));
    bSorted = b.sort(dynamicSortMultiple.apply(this, aKeys)); 

    if (JSON.stringify(aSorted) !== JSON.stringify(bSorted)) return false // different rows

    return true
} 


var checkQueryCorrectness = async function (query, DBServerConfig){

    const correctAnswer = DBServerConfig.correctAnswer
    return new Promise((resolve, reject) => {

        var resultObject = JSON.parse(correctAnswer);
        executeQuery(query, DBServerConfig)
        .then(result => {
            console.log('executeQuery result', result)
            if (isQueryResultEqual(resultObject.result, result)) resolve ('correct')
            else resolve ('wrong answer')
        })
        .catch(err => {
            console.log('err', err)
            resolve (err)
        })

    })

}


const readExecutionTimeFromResult = function (result) {

    //{ 'QUERY PLAN': 'Execution Time: 0.066 ms' }
    const executionTimeCell = result[result.length - 1]['QUERY PLAN']
    const executionTimeString = executionTimeCell.split(': ')[1]
    const executionTime = executionTimeString.split(' ')[0]
    return parseFloat(executionTime)

}

var checkExecutionTime = async function (query, DBServerConfig){
    console.log('checkExecutionTime', query, DBServerConfig)

    return new Promise((resolve, reject) => {

        const explain_analyze = 'EXPLAIN ANALYZE ' + query
        executeQuery(explain_analyze, DBServerConfig)
        .then(result => {
            const exeTime = readExecutionTimeFromResult(result)
            resolve (exeTime)
        })
        .catch(err => {
            console.log('err', err)
            resolve (err)
        })

    })

}

// TODO: set up new database for every query 
var setupSQL = async function (competitionDetails){

}

// TODO: delete database from DB server after the query
var resetSQL = async function (DBServerConfig){

}


var executeQuery = async function (query, DBServerConfig){
  
    // use defult setting in config file if no config find for competition
    var SQLConfig = DBServerConfig ? DBServerConfig : config

    // Send Query to SQL DB
    return new Promise((resolve, reject) => {

        if (isValid(query)){

            sql.query(SQLConfig, query)
            .then(result => {
                console.log(result)
                resolve (result.rows)
            })
            .catch(err => {
                console.log('sql.query', err)
                reject (err)
            })
        }
    })
}

var updateMongoDBQueryInfo = async function (submissionId, details){



}


var createSubmissionInMongoDB = async function(query, competitionName, creatorId){
    const submissionId = new ObjectID();

    const newSubmission = new Submission({
        id:submissionId,
        content: query,
        creatorId: creatorId,
        createTime: new Date(),
        competitionName: competitionName,
    })

    newSubmission.save()
    .then(result => {
        console.log('new submission created:', result)
        return submissionId        
    })
    .catch(err => console.log(err))

}

var updateCompetition = async function (submissionId, competitionName){

    return new Promise((resolve, reject) => {

        Competition.updateOne(
            {competitionName: competitionName},
            {
                $push: {competitionSubmissions: submissionId},
                $currentDate: { lastModified: true }
            }
        )
        .then(competition => {
            console.log(competition)
            resolve (competition)
        })
    })
    
}


var updateUser = async function (submissionId, creatorId){

    return new Promise((resolve, reject) => {

        User.updateOne(
            {creatorId: creatorId},
            {
                $push: {Submissions: submissionId},
                $currentDate: { lastModified: true }
            }
        )
        .then(user => {
            console.log(user)
            resolve (user)
        })
    })
    
}


var receiveQuery = async function(req,res){
    // setup();

    const creatorId = req.params.id
    const competitionName = req.query.competition
    const query = req.query.q;
    console.log(competitionName, query, creatorId)

    competitionDetails = await getCompetitionDetails(competitionName)
    // console.log(competitionDetails)
    
    const submissionId = createSubmissionInMongoDB(query, competitionName, creatorId)
    // const submissionId = new ObjectID('62448f3091a32b98f19bff03') // test
    updateCompetition(submissionId, competitionName)
    updateUser(submissionId, creatorId)

    // One database setup
    const DBServerConfig = competitionDetails.DBServerConfig

    // TODO
    // create new database for each new query
    // const DBServerConfig = setupSQL(competitionDetails);

    checkQueryCorrectness(query, DBServerConfig)
    .then(isQueryCorrect => {
        console.log('isQueryCorrect', isQueryCorrect)

        // TODO
        // updateMongoDBQueryInfo(submissionId, {"correctness": isQueryCorrect})

        switch (isQueryCorrect) {
            case 'correct': // check for execution time if query return correct answer
                console.log('correct')
                checkExecutionTime(query, DBServerConfig)
                .then(executionTime => {
                    // console.log(executionTime)
                    // TODO
                    // updateMongoDBQueryInfo(queryId, {"executionTime": executionTime})
                    // resetSQL(databaseDetails)
                    res.status(200).json(executionTime)
                });
                break;
            case 'wrong answer': // stop and return 
                console.log('wrong', isQueryCorrect);
                res.status(200).json('Wrong')
                break;
            case 'timeout': // stop and return
                console.log('timeout');
                res.status(200).json('Query timeout!')
                break;
            default:
                console.log(isQueryCorrect);
                res.status(200).json('SQL error')
                break;
        }

    })
    .catch(err => {
        console.log(err)
        res.status(400).json('Invalid Query Submitted!')
    })

}


module.exports.receiveQuery = receiveQuery;
