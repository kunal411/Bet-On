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

    let homePlayerDet = {
        'wicketkeeper' : [],
        'batsman' : [],
        'bowler' : [],
        'allRounder' : []
    }

    let awayPlayerDet = {
        'wicketkeeper' : [],
        'batsman' : [],
        'bowler' : [],
        'allRounder' : []
    }
    
    let contestsDetails = [];
    let matchDet = {
        "results": []
    };

    try{
        let match = await MatchLiveDetail.findOne({matchId : match_id});  
        if(match){
            for(let x of match.teamHomePlayers){
                if(x.position == 'wicketkeeper'){
                    homePlayerDet.wicketkeeper.push(x);
                }else if(x.position == 'batsman'){
                    homePlayerDet.batsman.push(x);
                }else if(x.position == 'bowler'){
                    homePlayerDet.bowler.push(x);
                }else{
                    homePlayerDet.allRounder.push(x);
                }
            }

            for(let x of match.teamAwayPlayers){
                if(x.position == 'wicketkeeper'){
                    awayPlayerDet.wicketkeeper.push(x);
                }else if(x.position == 'batsman'){
                    awayPlayerDet.batsman.push(x);
                }else if(x.position == 'bowler'){
                    awayPlayerDet.bowler.push(x);
                }else{
                    awayPlayerDet.allRounder.push(x);
                }
            }

            lineOut=true;
            let s = {
                live_details : {
                    teamsheets : {
                        home : {
                            playerListHome : match.teamHomePlayers,
                            homePlayerDet : homePlayerDet
                        },

                        away : {
                            playerListAway : match.teamAwayPlayers,
                            awayPlayerDet : awayPlayerDet
                        }
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


