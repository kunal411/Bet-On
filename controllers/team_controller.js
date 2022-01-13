const alert = require('alert');
const Team = require('../models/team');
const User = require('../models/user');

// Function to add team in database created by the user
module.exports.createTeam = async function(req, res){

    // team details
    const teamArray = JSON.parse(req.query.teamArray);
    const matchId = req.query.id;
    const userId = req.user.userId;

    // captain and vice-captain details
    const captain = req.query.captainId;
    const viceCaptain = req.query.viceCaptainId;

    let team = new Team();
    let teamId = matchId + userId;
    team.teamId = teamId;

    for(let x of teamArray){
        let playerObj = {
            playerId: x.playerId,
            playerName: x.playerName,
            position: x.position,
            points: x.points
        }
        team.players.push(playerObj);
    }

    team.points = 50;
    team.userId = userId;
    team.matchId = matchId;
    team.captainId = captain;
    team.viceCaptainId = viceCaptain;

    try{
        // Finding team in database 
        const team4 = await Team.findOne({teamId: teamId});
        if(team4){
            // Updating the team if already exist in database
            const team1 = await Team.updateOne({teamId: teamId},{$set:{
                players:team.players,
                captainId: captain,
                viceCaptainId: viceCaptain
            }});
            if(team1){
                req.flash('success','Team Succesfully Updated!!');
                return res.redirect('back');
            }
            
        }else{
            // creating team in databse if not present
            const team2 = await Team.create(team);
            if(team2){

                // Updating number to teams created in user document
                let userUpdate = await User.findOneAndUpdate({userId: userId}, { $inc : {
                    numberOfTeamsCreated: 1
                }});
                console.log('team is successfully added in db! ');
                req.flash('success','Team Succesfully Created!!');
                return res.redirect('back');
            }
        }
    }catch(err){
        console.log("Error : " + err);
    }
    return res.redirect('back');
}