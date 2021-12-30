const Contest = require('../models/contest');
const Match = require('../models/match');
const User = require('../models/user');

module.exports.createContest = function(req, res){
    const userId = req.user.userId;
    const entryAmount = req.query.entryAmount;
    const spots = req.query.spots;
    const numWinners = req.query.winners;
    const matchId = req.query.matchId;
    let contest = new Contest();
    contest.price = entryAmount*spots;
    contest.totalSpots = spots;
    contest.spotsLeft = spots;
    contest.matchId = matchId;
    contest.admin = userId;
    contest.numWinners = numWinners;
    contest.userIds.push(userId);
    try{
        let newContest = await Contest.create(contest);
        const newContestId = newContest.id;
        if(newContest){
            try{
                let match1 = await Match.findOne({matchId : matchId})
                let matchcontestArray = match1.contestId;
                matchcontestArray.push(newContestId);
            }catch(err){
                console.log('Error : ' + err);
            }


            try{
                let match = await Match.updateOne({matchId: matchId}, {$set : {
                    contestId: matchcontestArray
                }});
            }catch(err){
                console.log('Error : ' + err);
            }


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
    return res.redirect('back');
}