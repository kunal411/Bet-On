const mongoose = require('mongoose');
const crypto = require('crypto');

const contestSchema = new mongoose.Schema({
    contestId: {
        type : String,
        trim : true,
        required : true,
        unique : true,
        lowercase : true
    },

    price: {
        type : Number,
        required : true,
    },

    totalSpots:{
        type : Number,
        required : true,
    },

    spotsLeft: {
        type : Number,
        required : true,
    },

    teams: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        }
    ],

    matchId: {
        type : String,
        trim : true,
        required : true,
        lowercase : true
    }
},{
    timestamps : true
});

const Contest = mongoose.model('Contest',contestSchema);
module.exports = Contest;