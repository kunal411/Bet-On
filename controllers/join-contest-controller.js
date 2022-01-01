const Contest = require('../models/contest');
const Team = require('../models/team');
const User = require('../models/user');
const alert = require('alert');

module.exports.joinContest = async function(req,res){
    const matchId = req.query.matchId;
    const userId = req.user.userId;
    const contestCode = req.query.joinCode;

    try{
        const contest = await Contest.findOne({_id:contestCode, matchId : matchId});
        if(contest){
            let userArray = contest.userIds;
            for(let x of userArray){
                if(userId == x){
                    alert('User Already Registered!!!');
                    return res.redirect('back');
                }
            }
            userArray.push(userId);
            let teamsIdArray = contest.teamsId;
            let spotsLeft = contest.spotsLeft;
            if(spotsLeft == 0){
                alert('Contest Already Full!!');
                return res.redirect('back');
            }
            spotsLeft--;
            try{
                const team = await Team.findOne({matchId:matchId , userId:userId});
                if(team){
                    teamsIdArray.push(team.teamId);
                    try{
                        const updateContest = await Contest.updateOne({_id : contestCode},{$set : {
                            spotsLeft : spotsLeft,
                            teamsId : teamsIdArray,
                            userIds : userArray
                        }})
                    }catch(err){
                        console.log('Error : ' + err);
                    }
                }else{
                    alert('Create Team First!!');
                    return res.redirect('back');
                }
            } 
            catch(err){
                console.log('Error : ' + err);
                alert('Create Team First!!');
                return res.redirect('back');
            }
            try{
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
                    try{
                        let userUpdate = await User.updateOne({userId: userId}, { $set : {
                            matchIds : matchIdsArray,
                            numberOfContestJoined: numberOfContestJoined
                        }});
                        console.log('Match Successfully added in user database');
                    }catch(err){
                        console.log('Error : ' + err);
                    }
                }
            }
            catch(err){
                console.log('Error : ' + err);
            }
        }else{
            alert('Invalid Contest Code!')
        }
    }catch(err){
        console.log('Error : ' + err);
    }
    return res.redirect('back');

}