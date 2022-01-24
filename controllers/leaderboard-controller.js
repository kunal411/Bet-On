const Contest = require('../models/contest');
const Team = require('../models/team');
const MatchLiveDet = require('../models/match_live_details');


module.exports.leaderBoardUpdate = async function(req,res){
    if (!req.isAuthenticated()) {
        req.flash('error','Please login');
        return res.redirect(`${process.env.PORTURL}/users/sign-in`);
    } 

    const matchId = req.query.matchId;
    const contestId = req.query.contestId;
    const userId = req.user.userId;
    let numberOfWinners;
    let results = [];
    let inPlay;
    let mathcResult;
    let chatMessages;
    try{
        let match = await MatchLiveDet.findOne({matchId : matchId});
        if(match){
            inPlay = match.inPlay;
            mathcResult = match.result;
        }
    }catch(err){
        console.log('Err : ' + err);
    }

    try{
        const contest = await Contest.findOne({_id : contestId});
        if(contest){
            chatMessages = contest.chatMessages;
            const teamsArray = contest.teamsId;
            numberOfWinners = contest.prizeDetails.length;
            for(let teamId of teamsArray){
                try{
                    const team = await Team.findOne({teamId : teamId});
                    if(team){
                        let teamInfo = {
                            userName : team.userId,
                            userPoints : team.points,
                            players : team.players,
                            captain: team.captainId,
                            vicecaptain: team.viceCaptainId
                        }
                        results.push(teamInfo);
                    }
                }catch(err){
                    console.log('Error : ' + err);
                }
            }
        }
    }catch(err){
        console.log('Error : ' + err);
    }
    return res.render('leaderboard',{
        title : "Leaderboard",
        result : results,
        userId : userId,
        numberOfWinners : numberOfWinners,
        inPlay: inPlay,
        mathcResult: mathcResult,
        contestId : contestId,
        chatMessages: chatMessages
    })
}