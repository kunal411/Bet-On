const MatchLiveDetail = require('../models/match_live_details');

module.exports.contest = function(req,res){
    const match_id = req.query.id;
    const homeTeamName = req.query.homeTeamName;
    const awayTeamName = req.query.awayTeamName;
    
    let matchDet = {
        "results": []
    };
    let lineOut = true;
    MatchLiveDetail.findOne({matchId : match_id}, function(err , match){
        if(err){
            console.log('Error in finding match id in match details ');
            return;
            // return res.redirect('http://localhost:8000/users/sign-up');
        }
        else if(match){
            let s = {
                live_details : {
                    teamsheets : {
                        home : match.teamHomePlayers,
                        away : match.teamAwayPlayers
                    }
                }
            }
            matchDet.results.push(s);
        }else{
            lineOut=false;
            console.log('Live details are not out yet..');
        }
    })
    
    return res.render('contest_card', {
    title: 'Contests',
    match_details: matchDet,
    homeTeamName: homeTeamName,
    awayTeamName: awayTeamName,
    lineupsOut : lineOut
    })
}
