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
    ],

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