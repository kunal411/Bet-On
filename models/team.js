const mongoose = require('mongoose');
const crypto = require('crypto');

const teamSchema = new mongoose.Schema({

    teamId : {
        type : String,
        trim : true,
        required : true,
        unique : true,
        lowercase : true
    },

    players : [
        {
            playerId : {
                type : String,
                trim : true,
                required : true,
                lowercase : true
            },

            playerName: {
                type : String,
                trim : true,
                required : true,
                lowercase : true
            },

            position: {
                type : String,
                trim : true,
                required : true,
                lowercase : true
            },

            point: {
                type : Number,
                required : true,
                default: 4
            }
        }
    ],

    points: {
        type : Number,
        required : true
    },

    userId: {
        type : String,
        trim : true,
        required : true,
        lowercase : true
    },

    matchId: {
        type : String,
        trim : true,
        required : true,
        lowercase : true
    }
},{
    timestamps : true
});

const Team = mongoose.model('Team',teamSchema);
module.exports = Team;