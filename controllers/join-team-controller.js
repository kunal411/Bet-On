const alert = require('alert');
const Contest = require('../models/contest');
const Team = require('../models/team');

module.exports.joinTeam = async function(req, res){
    const contestId = req.query.contestId;
    const matchId = req.query.matchId;
    // console.log('kunal ' + matchId);
    try{
        let team = await Team.findOne({matchId : matchId});
        if(team){
            try{
                
                let contest = await Contest.findOne({_id: contestId});
                let teamsId = contest.teamsId;
                let spotsLeft = contest.spotsLeft;
                function checkTeam(teamId) {
                    return teamId == team.teamId;
                }
                let isPresent = contest.teamsId.find(checkTeam);
                console.log(isPresent);
                if(isPresent == team.teamId){
                    alert('Already registered in this contest!');
                    return res.redirect('back');
                }

                if(spotsLeft == 0){
                    alert('Contest is already full!!');
                    return res.redirect('back');
                }
                teamsId.push(team.teamId);
                try{
                    let contest1 = await Contest.updateOne({_id: contestId}, {$set:{teamsId:teamsId , spotsLeft:spotsLeft-1}});
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