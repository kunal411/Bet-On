const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type : String,
        trim : true,
        required : true,
        unique : true,
        lowercase : true
    },

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
    },

    matchIds: [
        {
            type : String,
            trim : true,
            lowercase : true
        }
    ],

    numberOfContestJoined : {
        type: Number,
        required: true,
        default: 0
    },

    numberOfContestWon : {
        type: Number,
        required: true,
        default: 0
    },

    numberOfTeamsCreated : {
        type: Number,
        required: true,
        default: 0
    },

    totalAmountWon : {
        type: Number,
        required: true,
        default: 0
    },

    wallet : {
        type: Number,
        required: true,
        default: 0
    },

    contact_id : {
        type : String,
        required : true,
        unique : true,
    },

    ifsc : {
        type : String
    }, 

    accountNumber:{
        type : String
    },

    fundId:{
        type: String
    },

    followers : [
        {
            type : String,
            trim : true,
        }
    ],
    
    following : [
        {
            type : String,
            trim : true,
        }
    ]

},{
    timestamps : true
});

const User = mongoose.model('User',userSchema);
module.exports = User;