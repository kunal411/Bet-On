// Imported all required Schema.
const Contest = require('../models/contest');
const Team = require('../models/team');
const User = require('../models/user');

module.exports.joinTeam = async function(req, res){

    const contestId = req.query.contestId;
    const matchId = req.query.matchId;
    const teamId = matchId + req.user.userId;
    const userId = req.user.userId;
    
    try{
        let team = await Team.findOne({teamId : teamId});
        if(team){

            let contest = await Contest.findOne({_id: contestId});
            let teamsId = contest.teamsId;
            let spotsLeft = contest.spotsLeft;
            let userIdsArray = contest.userIds;
            let price = contest.price;
            let totalSpots = contest.totalSpots;

            const contestPrice = price / totalSpots;
            function checkTeam(teamId) {
                return teamId == team.teamId;
            }

            let isPresent = contest.teamsId.find(checkTeam);
            if(isPresent == team.teamId){
                req.flash('warning','Already registered in this contest!');
                return res.redirect('back');
            }

            if(spotsLeft == 0){
                req.flash('warning','Contest is already full!!');
                return res.redirect('back');
            }

            teamsId.push(team.teamId);
            userIdsArray.push(userId);

            let contest1 = await Contest.updateOne({_id: contestId}, {$set:{
                teamsId:teamsId,
                spotsLeft:spotsLeft-1,
                userIds : userIdsArray
            }});
            
            if(contest1){
                req.flash('success','Contest joined successfully!');
                let user = await User.findOne({userId : userId});
                if(user){
                    let matchIdsArray = user.matchIds;
                    let isMatchPresent = false;
                    let numberOfContestJoined = user.numberOfContestJoined + 1;

                    for(let x of matchIdsArray){
                        if(x == matchId){
                            isMatchPresent = true;
                            break;
                        }
                    }

                    if(!isMatchPresent){
                        matchIdsArray.push(matchId);
                    }

                    let userUpdate = await User.updateOne({userId: userId}, { $set : {
                        matchIds : matchIdsArray,
                        numberOfContestJoined: numberOfContestJoined,
                        wallet : user.wallet - contestPrice
                    }});
                    
                    console.log('Match Successfully added in user database');
                }
            }
        }else{
            req.flash('warning','Create team first!');
        }
    }catch(err){
        console.log('Error : ' + err);
    }
    
    return res.redirect('back');
}