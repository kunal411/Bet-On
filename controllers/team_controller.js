const alert = require('alert');
const Team = require('../models/team');

module.exports.createTeam = async function(req, res){
    const teamArray = JSON.parse(req.query.teamArray);
    const matchId = req.query.id;
    const userId = req.user.userId;

    const captain = req.query.captainId;
    const viceCaptain = req.query.viceCaptainId;

    console.log("**************" + captain);
    console.log("*-*******-******-----" + viceCaptain);

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
        const team4 = await Team.findOne({teamId: teamId});
        if(team4){
            try{
                const team1 = await Team.updateOne({teamId: teamId},{$set:{players:team.players}});
                if(team1){
                    alert('Team Succesfully Updated!!');
                }
            }catch(err){
                console.log("Error : " + err);
            }
    
        }else{
            try{
                const team2 = await Team.create(team);
                if(team2){
                    console.log('team is successfully added in db! ');
                }
            }catch(err){
                console.log("Error : " + err);
            }
        }
    }catch(err){
        console.log("Error : " + err);
    }
    return res.redirect('back');

}