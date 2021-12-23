const alert = require('alert');
const Contest = require('../models/contest');
const Team = require('../models/team');

module.exports.joinTeam = async function(req, res){
    const contestId = req.query.contestId;
    const matchId = req.query.matchId;
    console.log('kunal ' + matchId);
    console.log('kunal contest ' + contestId);
    try{
        let team = await Team.findOne({matchId : matchId});
        if(team){
            try{
                let contest = await Contest.findOne({contestId: contestId});
                let teamsId = contest.teamsId;
                teamsId.push(team.teamId);
                try{
                    let contest1 = await Contest.updateOne({contestId: contestId}, {$set:{teamsId:teamsId}});
                    if(contest1){
                        alert('Contest joined successfully!');
                    }
                }catch(err){
                    console.log('Error : ' + err);
                }
            }catch(err){
                console.log('Error : ' + err);
            }
        }else{
            alert('Create team first!');
        }
    }catch(err){
        console.log('Error : ' + err);
    }
    return res.redirect('back');
}