const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        trim : true,
        required : true,
    },
    name : {
        type : String,
        trim : true,
        required: true
    },
    phone : {
        type : String,
        trim : true
    }
},{
    timestamps : true
});

const User = mongoose.model('User',userSchema);
module.exports = User;