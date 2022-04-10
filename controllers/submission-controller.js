
const sql = require('../services/sql-query-service')
const mongoose = require("mongoose");

const DBServerConfig = require('../config/config').createConfig
const Submission = require("../models/Submissions");
const Competition = require("../models/Competitions");
const User = require("../models/users");

ObjectID = require('mongodb').ObjectId;


var getCompetitionDetails = async function (competitionName){

    return new Promise((resolve, reject) => {

        Competition.findOne({ competitionName: competitionName })
        .then((competition) => {
        if (!competition) {
            reject ("Competition not found");
        } else {
            resolve (competition)
        }

        })
    })

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
var isQueryResultEqual = function (a, b){

    if (a.length !== b.length) return false // different number of rows
    else{
        if (a.length == 0) return true // both empty result

        aKeys = Object.keys(a[0])
        bKeys = Object.keys(b[0])
        aKeys.sort()
        bKeys.sort()
    
        if (JSON.stringify(aKeys) !== JSON.stringify(bKeys)) return false // different column names
        
        // aSorted = a.sort(dynamicSortMultiple.apply(this, aKeys));
        // bSorted = b.sort(dynamicSortMultiple.apply(this, aKeys)); 
    
        // if (JSON.stringify(aSorted) !== JSON.stringify(bSorted)) return false // different rows
        if (JSON.stringify(a) !== JSON.stringify(b)) return false // different rows content
    
    
        return true

    }

} 


var checkQueryCorrectness = async function (query, DBServerConfig, correctAnswer){
    
    var resultObject = JSON.parse(correctAnswer);
    // const correctAnswer = DBServerConfig.correctAnswer
    return new Promise((resolve, reject) => {
        console.log('query', query)

        executeQuery(query, DBServerConfig)
        .then(result => {
            console.log('checkQueryCorrectness result', result)
            if (isQueryResultEqual(resultObject.result, result)) resolve ('correct')
            else resolve ('wrong answer')
        })
        .catch(err => {
            console.log('err', err)
            resolve (err)
        })

    })

}


const getExecutionAndPlanningTime = function (result) {

    //{ 'QUERY PLAN': 'Execution Time: 0.066 ms' }
    const executionTimeCell = result[result.length - 1]['QUERY PLAN']
    const executionTimeString = executionTimeCell.split(': ')[1]
    const executionTime = executionTimeString.split(' ')[0]

    const planningTimeCell = result[result.length - 2]['QUERY PLAN']
    const planningTimeString = planningTimeCell.split(': ')[1]
    const planningTime = planningTimeString.split(' ')[0]

    return [parseFloat(executionTime), parseFloat(planningTime)]

}

var checkRunningTimes = async function (query, DBServerConfig){
    console.log('checkRunningTimes', query, DBServerConfig)

    return new Promise((resolve, reject) => {

        const explain_analyze = 'EXPLAIN ANALYZE ' + query
        executeQuery(explain_analyze, DBServerConfig)
        .then(result => {
            console.log('explain_analyze', result)
            const [exeTime, planTime] = getExecutionAndPlanningTime(result)
            resolve({
                "executionTime": exeTime,
                "planningTime": planTime,
            })
        })
        .catch(err => {
            console.log('err', err)
            resolve (err)
        })

    })

}


// set up new database for every query 
var setupSQL = async function (DBServerConfig, creationQueries, databaseName){

    const newDBQuery = `CREATE DATABASE ` + databaseName + `; `
    console.log('Setting up new SQL DB for submission...', newDBQuery)

    return new Promise((resolve, reject) => {

        executeQuery(newDBQuery, DBServerConfig)
        .then(result => {
            DBServerConfig['database'] = databaseName
            
            executeQuery(creationQueries, DBServerConfig)
            .then(result => {
                // console.log('creationQueries result', result)
                resolve ({"result": result})
            })
            .catch(err => {
                console.log('err', err)
                reject (err)
            })
    
        })
        .catch(err => {
            console.log('err', err)
            reject (err)
        })

    })


}

// Delete the database after query finish execution
var cleanSQL = async function (DBServerConfig, competitionName, databaseName){

    DBServerConfig['database'] = competitionName

    const query = `DROP DATABASE IF EXISTS ` + databaseName;

    return new Promise((resolve, reject) => {

        executeQuery(query, DBServerConfig)
        .then(result => {
            console.log('cleanSQL executeQuery result', result)
            resolve ({"result": result})
        })
        .catch(err => {
            console.log('err', err)
            resolve (err)
        })

    })

}

var getCorrectAnswer = async function (query, DBServerConfig){
    return new Promise((resolve, reject) => {
        executeQuery(query, DBServerConfig)
        .then(result => {
            console.log('getCorrectAnswer executeQuery result', result)
            resolve (JSON.stringify({"result": result}))
        })
        .catch(err => {
            console.log('err', err)
            resolve (err)
        })
    })
}

// Make sure the database in DBServerConfig is correct
var executeQuery = async function (query, DBServerConfig){

    // Send Query to SQL DB
    return new Promise((resolve, reject) => {

        sql.query(DBServerConfig, query)
        .then(result => {
            // console.log(result)
            resolve (result.rows)
            // resolve (result)
        })
        .catch(err => {
            console.log('sql.query', err)
            reject (err)
        })

    })
}

var updateSubmission = async function (submissionId, details){

    return new Promise((resolve, reject) => {

        Submission.updateOne(
            {id: submissionId}, 
            {$set: details}
        )
        .then((res) => {
            Submission.findOne({id:submissionId})
            .then(sub => console.log(sub))
            resolve(res)            
        })
        .catch(err => {
            reject (err)
        })
    })

}


var createSubmission = async function(query, competitionName, creatorId){
    console.log('createSubmission', query, competitionName, creatorId)

    return new Promise((resolve, reject) => {

        const submissionId = new ObjectID();

        const newSubmission = new Submission({
            id: submissionId,
            content: query,
            creatorId: creatorId,
            createTime: new Date(),
            competitionName: competitionName,
        })

        newSubmission.save()
        .then(result => {
            console.log('new submission created:', result)
            resolve (submissionId)        
        })
        .catch(err => {
            console.log(err)
            reject(err)})
    })

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
    console.log('creatorId',creatorId)
    return new Promise((resolve, reject) => {

        User.updateOne(
            {email: creatorId},
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

var runQuery = async function(info){

    const creatorId = info.creatorId
    const competitionName = info.competition
    const query = info.query;

    const competitionDetails = await getCompetitionDetails(competitionName)

    const correctAnswer = competitionDetails.correctAnswer 
    console.log('correctAnswer', correctAnswer)

    const submissionId = await createSubmission(query, competitionName, creatorId)
    // const submissionId = new ObjectID('62448f3091a32b98f19bff03') // test
    console.log("submissionId", submissionId)

    const competitionRes = await updateCompetition(submissionId, competitionName)
    const userRes = await updateUser(submissionId, creatorId)

    // create new database for each new query
    const databaseName = 'sub_' + competitionName.toLowerCase().replace(/ /g, '_') + '_' + submissionId

    DBServerConfig['database'] = competitionName
    DBServerConfig['statement_timeout'] = competitionDetails.statementTimeout 
    
    return new Promise((resolve, reject) => {

        setupSQL(DBServerConfig, competitionDetails.creationQueries, databaseName)
        .then(setupResult => {
            console.log('setupResult', setupResult)
            console.log('query', query)

            checkQueryCorrectness(query, DBServerConfig, correctAnswer)
            .then(getQueryResult => {
                console.log('isQueryCorrect', getQueryResult)

                updateSubmission(submissionId, {"queryResult": getQueryResult})
                .then(result => {

                    switch (getQueryResult) {
                        case 'correct': // check for execution time if query return correct answer
                            // console.log('correct')
                            checkRunningTimes(query, DBServerConfig)
                            .then(runningTimes => {
                                submission = updateSubmission(submissionId, runningTimes)
                                clean = cleanSQL(DBServerConfig, competitionName, databaseName)
                                Promise.all([submission, clean])
                                .then(result => {
                                    resolve(runningTimes)
                                })
                            });
                            break;
                        case 'wrong answer': // stop and return 
                            cleanSQL(DBServerConfig, competitionName, databaseName)
                            resolve('Wrong')
                            break;
                        case 'timeout': // stop and return
                            cleanSQL(DBServerConfig, competitionName, databaseName)
                            resolve('Query timeout!')
                            break;
                        default:
                            cleanSQL(DBServerConfig, competitionName, databaseName)
                            resolve('SQL Query error')
                            break;
                    }

                })
                .catch(err => {
                    cleanSQL(DBServerConfig, competitionName, databaseName)
                    reject(err)
                })

            })
            .catch(err => {
                console.log(err)
                cleanSQL(DBServerConfig, competitionName, databaseName)
                reject('Invalid Query Submitted!')

            })

        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
    })

}


process.on('message', async (msg) => {
    try {
        //mongo connection
        mongoose.connect("mongodb://127.0.0.1:27017/5421", { useNewUrlParser: true });
        const connection = await mongoose.connection;
        connection.once("open", function () {
        console.log("MongoDB database connection established successfully for a submission" + msg.info.creatorId);
        });
        const queryResult = await runQuery(msg.info);

        process.send(queryResult);
    } catch (err) {
        console.log('process err', err)
        process.send(err);
    }

});


const getSubmissionById = async function (id){
    console.log(id)
    return new Promise((resolve, reject) => {
        Submission.findOne({ id: id })
        .then(submission => {
            if (!submission) reject (id)
            console.log('submission',submission)
            resolve(submission)
        })

    })
}


const getSubmissionsByCompetition = async function (req, res){
    const competitionName = req.params.name
    console.log('competitionName', competitionName)

    Competition.findOne({ competitionName: competitionName })
    .then(competition => {
        let promises = []
        const submissionIds = competition.competitionSubmissions
        for (const id of submissionIds) {
            promises.push(getSubmissionById(id))
        }    
        Promise.all(promises)
        .then((results) => {
            return res.status(200).send(results);
        })
        .catch((e) => {
            return res.status(400).send(e);
        });
    })
}




const getSubmissionsByUser = async function (req, res){
    const userId = req.params.id

    User.findOne({ email: userId })
    .then(user => {
        let promises = []
        const submissionIds = user.Submissions
        for (const id of submissionIds) {
            promises.push(getSubmissionById(id))
        }    
        Promise.all(promises)
        .then((results) => {
            return res.status(200).send(results);
        })
        .catch((e) => {
            return res.status(400).send(e);
        });
    })

}

// module.exports.receiveQuery = receiveQuery;
module.exports.runQuery = runQuery;
module.exports.getCorrectAnswer = getCorrectAnswer;
module.exports.getSubmissionsByCompetition = getSubmissionsByCompetition;
module.exports.getSubmissionsByUser = getSubmissionsByUser;
