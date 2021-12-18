const mongoose = require('mongoose');
const crypto = require('crypto');

const matchDetailsSchema = new mongoose.Schema({
    matchId : {
        type : String,
        trim : true,
        required : true,
        unique : true,
        lowercase : true
    },

    teamHomePlayers: [
        {
            playerId : {
                type : String,
                trim : true,
                required : true,
                unique : true,
                lowercase : true
            },

            playerName: {
                type : String,
                trim : true,
                required : true,
                lowercase : true
            },

            points: {
                type : Number,
                required : true
            }
        }
    ],

    teamAwayPlayers: [
        {
            playerId : {
                type : String,
                trim : true,
                required : true,
                unique : true,
                lowercase : true
            },

            playerName: {
                type : String,
                trim : true,
                required : true,
                lowercase : true
            },

            points: {
                type : Number,
                required : true
            }
        }
    ]

},{
    timestamps : true
});

const MatchLiveDetails = mongoose.model('MatchLiveDetails',matchDetailsSchema);
module.exports = MatchLiveDetails;