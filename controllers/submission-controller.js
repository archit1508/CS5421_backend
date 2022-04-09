
const sql = require('../services/sql-query-service')
// const config = require('../config/config').defultConfig
const Submission = require("../models/Submissions");
const Competition = require("../models/Competitions");
const DBServerConfig = {
    database: 'Tutorial',
    user: 'postgres',
    host: 'localhost',
    password: '19930102',
    port: 5432,
    // statement_timeout: 10000
}
ObjectID = require('mongodb').ObjectId;



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
            statementTimeout: 10000, //milliseconds
            creationQueries: `
            CREATE TABLE warehouse (
                w_id INTEGER PRIMARY KEY,
                w_name VARCHAR(50),
                w_street VARCHAR(50),
                w_city VARCHAR(50),
                w_country VARCHAR(50)
            );
            INSERT INTO warehouse (w_id, w_name, w_street, w_city, w_country) VALUES (301, 'Schmedeman', 'Sunbrook', 'Singapore', 'Singapore');

            CREATE TABLE item (
                i_id INTEGER PRIMARY KEY,
                i_im_id CHAR(8) UNIQUE NOT NULL,
                i_name VARCHAR(50)  NOT NULL,
                i_price NUMERIC(5, 2)  NOT NULL CHECK(i_price >0));
                INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (1, '35356226', 'Indapamide', 95.23);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (2, '00851287', 'SYLATRON', 80.22);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (3, '52549414', 'Meprobamate', 11.64);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (4, '54868007', 'MECLIZINE HYDROCHLORIDE', 54.49);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (5, '24658312', 'Doxycycline Hyclate', 28.99);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (6, '11822073', 'miconazole 1', 73.35);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (7, '51393666', 'Nevi (Mole) Control', 96.86);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (8, '60512629', 'KALI BICHROMICUM', 15.6);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (9, '68788973', 'TOPIRAMATE', 48.58);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (10, '60429082', 'Glipizide', 12.62);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (11, '50241141', 'Skyline Antibacterial Hand Cleanser', 75.03);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (12, '00540097', 'Oxcarbazepine', 18.86);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (13, '67345078', '4 in 1 Pressed Mineral SPF 15 Porcelain', 62.04);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (14, '36987288', 'Virginia Live Oak', 36.96);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (15, '67510150', 'Night Time Cold/Flu Relief Cherry', 92.26);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (16, '53942326', 'Tartar Control Plus', 50.96);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (17, '33992113', 'anti-dandruff', 18.73);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (18, '53645147', 'Ferrum Metallicum', 67.92);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (19, '44924010', 'BABOR Baborganic Crystal Face Scrub', 21.95);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (20, '16590303', 'Liothyronine Sodium', 52.9);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (21, '30142112', 'Kroger DayTime Flu plus Severe Cold and Cough', 88.69);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (22, '59078034', 'Tomatox Magic Massage Pack', 38.52);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (23, '63354871', 'BANANA BOAT', 98.86);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (24, '52731704', 'Anxiety Complex', 14.11);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (25, '49288012', 'Cattle Hair', 51.02);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (26, '68012054', 'Zegerid', 17.08);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (27, '53942502', 'NIGHT-TIME', 91.42);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (28, '49230191', 'DELFLEX', 38.96);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (29, '00934405', 'Clozapine', 70.14);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (30, '05361945', 'RULOX REGULAR', 17.76);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (31, '52125461', 'GENTAMICIN SULFATE', 93.43);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (32, '68012490', 'Fenoglide', 41.31);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (33, '57894071', 'Simponi', 1.3);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (34, '49527997', 'ACNE SOLUTIONS', 51.91);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (35, '50021301', 'SUNZONE SPORT SUNSCREEN SPF 30', 85.21);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (36, '29565200', 'Sunscreen', 55.7);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (37, '64942122', 'Dove Men plus Care', 41.28);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (38, '62750003', 'Zicam', 29.94);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (39, '05170410', 'Vasopressin', 85.02);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (40, '52959692', 'misoprostol', 6.92);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (41, '36987225', 'Jute', 31.03);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (42, '42195210', 'Pyrilamine Maleate and Phenylephrine Hydrochloride', 57.93);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (43, '52959613', 'Amoxicillin', 27.5);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (44, '76420780', 'Multi-Specialty Kit', 23.04);
            INSERT INTO item (i_id, i_im_id, i_name, i_price) VALUES (45, '60505287', 'Ropinirole', 7.24);

            CREATE TABLE stock (
                w_id INTEGER REFERENCES warehouse(w_id),
                i_id INTEGER REFERENCES item(i_id),
                s_qty SMALLINT CHECK(s_qty > 0),
                PRIMARY KEY (w_id, i_id));
                
                INSERT INTO stock VALUES (301, 1, 338);
                INSERT INTO stock VALUES (301, 4, 938);
                INSERT INTO stock VALUES (301, 5, 760);
                INSERT INTO stock VALUES (301, 8, 924);
                INSERT INTO stock VALUES (301, 12, 454);
                INSERT INTO stock VALUES (301, 13, 768);
                INSERT INTO stock VALUES (301, 21, 355);
                INSERT INTO stock VALUES (301, 22, 23);
                INSERT INTO stock VALUES (301, 31, 700);
                INSERT INTO stock VALUES (301, 36, 158);
                INSERT INTO stock VALUES (301, 42, 297);
                INSERT INTO stock VALUES (301, 44, 837);
                INSERT INTO stock VALUES (301, 45, 367);

 
                `

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


var checkQueryCorrectness = async function (query, DBServerConfig, correctAnswer){
    
    var resultObject = JSON.parse(correctAnswer);
    // const correctAnswer = DBServerConfig.correctAnswer
    return new Promise((resolve, reject) => {

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

    console.log('Setting up new SQL DB for submission...')
    const newDBQuery = `CREATE DATABASE ` + databaseName + `; `

    return new Promise((resolve, reject) => {

        executeQuery(newDBQuery, DBServerConfig)
        .then(result => {
            console.log('newDBQuery result', result)
            DBServerConfig['database'] = databaseName
    
            executeQuery(creationQueries, DBServerConfig)
            .then(result => {
                console.log('executeQuery result', result)
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
            console.log('executeQuery result', result)
            resolve ({"result": result})
        })
        .catch(err => {
            console.log('err', err)
            resolve (err)
        })

    })

}

var getCorrectAnswer = async function (query){
    return new Promise((resolve, reject) => {
        executeQuery(query, DBServerConfig)
        .then(result => {
            console.log('executeQuery result', result)
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
            console.log(result)
            resolve (result.rows)
        })
        .catch(err => {
            // console.log('sql.query', err)
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
    const submissionId = new ObjectID();

    const newSubmission = new Submission({
        id:submissionId,
        content: query,
        creatorId: creatorId,
        createTime: new Date(),
        competitionName: competitionName,
    })

    return new Promise((resolve, reject) => {

        newSubmission.save()
        .then(result => {
            console.log('new submission created:', result)
            resolve (submissionId)        
        })
        .catch(err => reject(err))
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


var runQuery = async function(req,res){
// var runQuery = async function(info){

    const creatorId = req.params.id
    const competitionName = req.query.competition
    const query = req.query.q;

    // const creatorId = info.id
    // const competitionName = info.competition
    // const query = info.q;

    const competitionDetails = await getCompetitionDetails(competitionName)


    const correctAnswer = competitionDetails.correctAnswer 
    // const correctAnswer = await getCorrectAnswer(query) // testing
    console.log(correctAnswer)

    const submissionId = await createSubmission(query, competitionName, creatorId)
    // const submissionId = new ObjectID('62448f3091a32b98f19bff03') // test

    // TODO: test
    // updateCompetition(submissionId, competitionName)
    // updateUser(submissionId, creatorId)


    // create new database for each new query
    const databaseName = competitionName.toLowerCase() + '_' + submissionId

    DBServerConfig['database'] = competitionName
    DBServerConfig['statement_timeout'] = competitionDetails.statementTimeout 
    
    console.log(DBServerConfig)

    setupSQL(DBServerConfig, competitionDetails.creationQueries, databaseName)
    .then(setupResult => {

        checkQueryCorrectness(query, DBServerConfig, correctAnswer)
        .then(getQueryResult => {
            console.log('isQueryCorrect', getQueryResult)

            updateSubmission(submissionId, {"queryResult": getQueryResult})
            .then(result => {

            switch (getQueryResult) {
                case 'correct': // check for execution time if query return correct answer
                    console.log('correct')
                    checkRunningTimes(query, DBServerConfig)
                    .then(runningTimes => {
                        submission = updateSubmission(submissionId, runningTimes)
                        clean = cleanSQL(DBServerConfig, competitionName, databaseName)
                        Promise.all([submission, clean])
                        .then(result => {
                            res.status(200).json(runningTimes)
                        })
                    });
                    break;
                case 'wrong answer': // stop and return 
                    cleanSQL(DBServerConfig, competitionName, databaseName)
                    res.status(200).json('Wrong')
                    break;
                case 'timeout': // stop and return
                    cleanSQL(DBServerConfig, competitionName, databaseName)
                    res.status(200).json('Query timeout!')
                    break;
                default:
                    cleanSQL(DBServerConfig, competitionName, databaseName)
                    res.status(200).json('SQL Query error')
                    break;
            }

            })
            .catch(err => {
                cleanSQL(DBServerConfig, competitionName, databaseName)
                return res.status(500).send(err)
            })

        })
        .catch(err => {
            console.log(err)
            cleanSQL(DBServerConfig, competitionName, databaseName)
            res.status(400).json('Invalid Query Submitted!')
        })

    })
    .catch(err => {
        console.log(err)
        return res.status(500).send(err.message)
    })

}

var test = async function(info){
    return new Promise((resolve, reject) => {
        console.log('start')

        resolve(runQuery(info))
        // setTimeout(function () {
        //     console.log('end')

        //     resolve (1)
        // }, 5000);
    })
}

process.on('message', async (msg) => {
    try {
        // const queryResult = await runQuery(msg.info);
        const queryResult = await test(msg.info);
        process.send(queryResult);
    } catch (err) {
        process.send(err);
    }

});



// module.exports.receiveQuery = receiveQuery;
module.exports.runQuery = runQuery;
module.exports.getCorrectAnswer = getCorrectAnswer;
