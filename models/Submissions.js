const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    id:{
        type:String
    },
    content:{
        type:String
    },
    creatorId:{ // TODO user email??
        type: String
    },
    createTime:{
        type:Date
    },
    // competitionId:{ // TODO competition name??
    competitionName:{ 
        type: String
    },
    queryResult:{
        type: String
    },
    executionTime:{
        type: Number
    },
    planningTime:{
        type: Number
    }
})

module.exports = Submission = mongoose.model("queries", SubmissionSchema);