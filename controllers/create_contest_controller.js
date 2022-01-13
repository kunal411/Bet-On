// Imported all required Schema.
const Contest = require('../models/contest');
const Match = require('../models/match');
const User = require('../models/user');
const Team = require('../models/team');
const transaction = require('../controllers/transaction_details_controller');

// function to create new user contest 
module.exports.createContest = async function(req, res){
    
    const userId = req.user.userId; // user id of user logged-in
    const entryAmount = req.query.entryAmount;
    const spots = req.query.spots;
    const numWinners = req.query.winners;
    const matchId = req.query.matchId;

    let userTeamId;
    try{
        // Finding team of user by matchId and userId to enroll team in new user contest
        const team = await Team.findOne({matchId : matchId , userId : userId});
        if(team){
            // team found
            userTeamId = team.teamId;
        }else{
            // team not found
            req.flash('error','Create Team First!');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error','Create Team First!');
        console.log("Error : " + err);
        return res.redirect('back');
    }

    // Initializing intance of the Contest schema
    let contest = new Contest();
    contest.price = entryAmount*spots;
    contest.totalSpots = spots;
    contest.spotsLeft = spots-1;
    contest.matchId = matchId;
    contest.admin = userId;
    contest.numWinners = numWinners;
    contest.userIds.push(userId);
    contest.teamsId.push(userTeamId);

    
    try{
        // Creating contest of user
        let newContest = await Contest.create(contest);
        const newContestId = newContest.id;
        if(newContest){
            // Finding Match to push contest in match document
            let match1 = await Match.findOne({matchId : matchId})
            let matchcontestArray = match1.contestId;
            matchcontestArray.push(newContestId);
            
            // Updating match document (adding contest in match document)
            let match = await Match.updateOne({matchId: matchId}, {$set : {
                contestId: matchcontestArray
            }});

            // Finding user to add the matchId in user document
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
                // If matchId is not present, then pushing it in document
                if(!isMatchPresent){
                    matchIdsArray.push(matchId);
                }
                
                transaction.createTransaction(userId, "", entryAmount, "joined contest");
                // Adding matchId and updating  number of contest joined and user wallet.
                let userUpdate = await User.updateOne({userId: userId}, { $set : {
                    matchIds : matchIdsArray,
                    numberOfContestJoined: numberOfContestJoined,
                    wallet : user.wallet - entryAmount
                }});
                console.log('Match Successfully added in user database');
                req.flash('success','Contest Joined and Created Successfully!');
                return res.redirect('back');
            }
        }
    }catch(err){
        console.log('Error : ' + err);
    }
    return res.redirect('back');
}