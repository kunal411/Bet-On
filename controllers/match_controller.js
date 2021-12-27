const alert = require('alert');
const MatchLiveDetail = require('../models/match_live_details');
const Contest = require('../models/contest');

module.exports.contest = async function(req,res){

    if (!req.isAuthenticated()) {
        return res.redirect('http://localhost:8000/users/sign-in');
    } 

    const match_id = req.query.id;
    const homeTeamName = req.query.homeTeamName;
    const awayTeamName = req.query.awayTeamName;
    let contestsDetails = [];

    let matchDet = {
        "results": []
    };

    try{
        let match = await MatchLiveDetail.findOne({matchId : match_id});  
        if(match){
            lineOut=true;
            let s = {
                live_details : {
                    teamsheets : {
                        home : match.teamHomePlayers,
                        away : match.teamAwayPlayers
                    },
                    extrasDetailFI : match.extrasDetailFI,
                    extrasDetailSI : match.extrasDetailSI,
                    fowFI : match.fowFI,
                    fowSI : match.fowSI,
                    inPlay : match.inPlay,
                    oversFI : match.oversFI,
                    oversSI : match.oversSI,
                    result : match.result,
                    runFI : match.runFI,
                    runSI : match.runSI,
                    status : match.status,
                    titleFI : match.titleFI,
                    titleSI : match.titleSI,
                    toss : match.toss,
                    wicketsFI : match.wicketsFI,
                    wicketsSI : match.wicketsSI
                }
            }
            try{
                let contests = await Contest.find({matchId : match_id});
                if(contests){
                    for(let x of contests){
                        let contestDet = {
                            contestId: x._id,
                            price : x.price,
                            totalSpots: x.totalSpots,
                            spotsLeft : x.spotsLeft,
                            teamsId : x.teamsId,
                            matchId : x.matchId,
                            prizeDetails : x.prizeDetails
                        }
                        contestsDetails.push(contestDet);
                    }
                }
            }catch(err){
                console.log("Error : " + err);
            }
            matchDet.results.push(s);
            return res.render('contest_card', {
                title: 'Contests',
                match_details: matchDet,
                homeTeamName: homeTeamName,
                awayTeamName: awayTeamName,
                lineupsOut : lineOut,
                matchId: match_id,
                contests: contestsDetails
            });
        }else{
            // console.log('Live details are not out yet..');
            alert('LineUps are not out yet!!');
            return res.redirect('back');
        }
    }catch(err){
        console.log("Error : " + err);
        return res.redirect('back');
    }
}


