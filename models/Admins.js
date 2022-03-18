const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type: String
    },
    department:{
        type: String
    },
    designation:{
        type: String
    }
})

module.exports = Admin = mongoose.model("admins", AdminSchema);