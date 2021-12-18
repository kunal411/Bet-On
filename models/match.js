const mongoose = require('mongoose');
const crypto = require('crypto');

const matchSchema = new mongoose.Schema({
    matchId : {
        type : String,
        trim : true,
        required : true,
        unique : true,
        lowercase : true
    },

    teamHomeName : {
        type : String,
        trim : true,
        required : true,
        lowercase : true
    },

    teamAwayName : {
        type : String,
        trim : true,
        required : true,
        lowercase : true
    },

    teamHomeCode : {
        type : String,
        trim : true,
        required : true,
        lowercase : true
    },

    teamAwayCode : {
        type : String,
        trim : true,
        required : true,
        lowercase : true
    },

    date : {
        type : String,
        required : true
    },

    matchTitle: {
        type: String,
        required: true
    },

    contests: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Contest'
        }
    ]
},{
    timestamps : true
});

const Match = mongoose.model('Match',matchSchema);
module.exports = Match;