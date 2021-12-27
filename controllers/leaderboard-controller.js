const Contest = require('../models/contest');
const Team = require('../models/team');


module.exports.leaderBoardUpdate = async function(req,res){
    if (!req.isAuthenticated()) {
        return res.redirect('http://localhost:8000/users/sign-in');
    } 

    const matchId = req.query.matchId;
    const contestId = req.query.contestId;
    const userId = req.user.userId;
    let numberOfWinners;

    let results = [];

    try{
        const contest = await Contest.findOne({_id : contestId});
        if(contest){
            const teamsArray = contest.teamsId;
            console.log('**************'+teamsArray);
            numberOfWinners = contest.prizeDetails.length;
            for(let teamId of teamsArray){
                try{
                    const team = await Team.findOne({teamId : teamId});
                    if(team){
                        let teamInfo = {
                            userName : team.userId,
                            userPoints : team.points,
                            players : team.players
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
    console.log('**************************************');
    console.log(results);
    return res.render('leaderboard',{
        title : "Leaderboard",
        result : results,
        userId : userId,
        numberOfWinners : numberOfWinners
    })
}   