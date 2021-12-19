const alert = require('alert');
const MatchLiveDetail = require('../models/match_live_details');

module.exports.contest = function(req,res){
    const match_id = req.query.id;
    const homeTeamName = req.query.homeTeamName;
    const awayTeamName = req.query.awayTeamName;
    
    let matchDet = {
        "results": []
    };
    let lineOut = false;
    MatchLiveDetail.findOne({matchId : match_id}, function(err , match){
        if(err){
            console.log('Error in finding match id in match details ');
            return;
        }
        else if(match){
            lineOut=true;
            let s = {
                live_details : {
                    teamsheets : {
                        home : match.teamHomePlayers,
                        away : match.teamAwayPlayers
                    }
                }
            }
            matchDet.results.push(s);
            return res.render('contest_card', {
                title: 'Contests',
                match_details: matchDet,
                homeTeamName: homeTeamName,
                awayTeamName: awayTeamName,
                lineupsOut : lineOut
            });
        }else{
            console.log('Live details are not out yet..');
            alert('LineUps are not out yet!!');
            return res.redirect('back');
        }
    })
}
