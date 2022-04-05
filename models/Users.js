const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    studentId:{
        type: String
    },
    competitionId:[],
    Submissions:[{type: Schema.Types.ObjectId, ref:"Submission"}]
});
module.exports = User = mongoose.model("users", UserSchema);