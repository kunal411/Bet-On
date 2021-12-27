const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
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

    teamsId : [
        {
            type : String,
            trim : true,
            lowercase : true
        }
    ],
    
    matchId: {
        type : String,
        trim : true,
        required : true,
        lowercase : true
    },

    prizeDetails : [
        {
            prize : {
                type : Number,
                required: true
            },
            prizeHolder : {
                type : String
            }
        }
    ]
},{
    timestamps : true
});

const Contest = mongoose.model('Contest',contestSchema);
module.exports = Contest;