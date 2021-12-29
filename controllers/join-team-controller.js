const alert = require('alert');
const Contest = require('../models/contest');
const Team = require('../models/team');
const User = require('../models/user');

module.exports.joinTeam = async function(req, res){
    const contestId = req.query.contestId;
    const matchId = req.query.matchId;
    const teamId = matchId + req.user.userId;
    const userId = req.user.userId;
    console.log(teamId);
    try{
        let team = await Team.findOne({teamId : teamId});
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
                        try{
                            let user = await User.findOne({userId : userId});
                            if(user){
                                let matchIdsArray = user.matchIds;
                                let isMatchPresent = false;
                                for(let x of matchIdsArray){
                                    if(x == matchId){
                                        isMatchPresent = true;
                                        break;
                                    }
                                }
                                if(!isMatchPresent){
                                    matchIdsArray.push(matchId);
                                    try{
                                        let userUpdate = await User.updateOne({userId: userId}, { $set : {
                                            matchIds : matchIdsArray
                                        }});
                                        console.log('Match Successfully added in user database');
                                    }catch(err){
                                        console.log('Error : ' + err);
                                    }
                                }
                            }
                        }
                        catch(err){
                            console.log('Error : ' + err);
                        }
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