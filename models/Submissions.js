const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    id:{
        type:String
    },
    content:{
        type:String
    },
    creatorId:{ // user email
        type: String
    },
    createTime:{
        type:Date
    },
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