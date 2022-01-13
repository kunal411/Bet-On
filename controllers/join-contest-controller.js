const { isValidObjectId } = require('mongoose');
const Contest = require('../models/contest');
const Team = require('../models/team');
const User = require('../models/user');
const transaction = require('../controllers/transaction_details_controller');

module.exports.joinContest = async function(req,res){
    const matchId = req.query.matchId;
    const userId = req.user.userId;
    const contestCode = req.query.joinCode;
    if(!isValidObjectId(contestCode)){
        console.log('Invalid code');
        req.flash('error','Invalid Contest Code!');
        return res.redirect('back');
    }

    try{
        const contest = await Contest.findOne({_id:contestCode, matchId : matchId});
        const user = await User.findOne({userId : userId});
        if(contest){
            const contestPrice = contest.price / contest.totalSpots;
            const userWallet = user.wallet;
            if(contestPrice > userWallet){
                req.flash('error',`Not enough balance. Add ${contestPrice - userWallet} in wallet`);
                return res.redirect('back');
            }
            let userArray = contest.userIds;
            for(let x of userArray){
                if(userId == x){
                    req.flash('error','User Already Registered!');
                    return res.redirect('back');
                }
            }
            userArray.push(userId);
            let teamsIdArray = contest.teamsId;
            let spotsLeft = contest.spotsLeft;
            if(spotsLeft == 0){
                req.flash('error','Contest Already Full!');
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
                    console.log('Create Team First!');
                    req.flash('error','Create Team First!');
                    return res.redirect('back');
                }
            } 
            catch(err){
                console.log('Error : ' + err);
                req.flash('error','Create Team First!');
                return res.redirect('back');
            }
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
                    transaction.createTransaction(userId, "", contestPrice, "joined contest");
                    let userUpdate = await User.updateOne({userId: userId}, { $set : {
                        matchIds : matchIdsArray,
                        numberOfContestJoined: numberOfContestJoined,
                        wallet : user.wallet - contestPrice
                    }});
                    console.log('Match Successfully added in user database');
                    req.flash('success','Contest Joined Successfully!');
                    return res.redirect('back');
                }catch(err){
                    console.log('Error : ' + err);
                }
            }
        }else{
            console.log('Invalid code');
            req.flash('error','Invalid Contest Code!');
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error : ' + err);
    }
    return res.redirect('back');

}