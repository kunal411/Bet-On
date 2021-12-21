const alert = require('alert');
const Team = require('../models/team');

module.exports.createTeam = function(req, res){
    const teamArray = JSON.parse(req.query.teamArray);
    const matchId = req.query.id;
    const userId = req.user.userId;
    for(let x of teamArray){
        console.log(x.playerName);
        console.log(x.playerId);
    }
    console.log(matchId);
    console.log(userId);
    let team = new Team();
    let teamId = matchId + userId;
    team.teamId = teamId;
    for(let x of teamArray){
        let playerObj = {
            playerId: x.playerId,
            playerName: x.playerName
        }
        team.players.push(playerObj);
    }
    team.points = 50;
    team.userId = userId;
    team.matchId = matchId;
    Team.findOne({teamId: teamId}, function(err, team4){
        if(err){
            console.log('Error in finding team in db, ' + teamId);
        }
        else if(team4){
            Team.updateOne({teamId: teamId}, {$set:{players:team.players}}, function(err, team1){
                if(err){
                    console.log('Error in updating team in db, ' + teamId);
                    return res.redirect('back');
                }
                alert('Team Succesfully Updated!!');
            })
        }
        else{
            Team.create(team, function(err, team2){
                if(err){
                    console.log('Error in creating team while putting in db', err);
                }
                else{
                    console.log('team is successfully added in db! ');
                }
            })
        }
        return res.redirect('back');
    })
    

}