const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompetitionsSchema = new Schema({
    creatorId:{
        type: String
    },
    participantsIds:[],
    competitionName:{
        type:String
    },
    competitionDescription:{
        type:String
    },
    competitionStartDate:{
        type:Date
    },
    competitionEndDate: {
        type: Date
    },
    competitionSubmissions:[]
})

module.exports = Competitions = mongoose.model("Competitions", CompetitionsSchema);