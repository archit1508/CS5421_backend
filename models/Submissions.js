const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    id:{
        type:String
    },
    content:{
        type:String
    },
    userId:{ // TODO user email??
        type: String
    },
    competitionId:{ // TODO user email??
        type: String
    },
    correctness:{
        type: Boolean
    },
    executionTime:{
        type: String
    },
    planningTime:{
        type: String
    }
})

module.exports = Submission = mongoose.model("queries", SubmissionSchema);