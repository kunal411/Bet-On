// Imported all required Schema.
const MatchLiveDetail = require('../models/match_live_details');
const Contest = require('../models/contest');
const Team = require('../models/team');
const User = require('../models/user');

module.exports.contest = async function(req,res){

    if (!req.isAuthenticated()) {
        req.flash('error','Please login');
        return res.redirect(`${process.env.PORTURL}/users/sign-in`);
    } 

    const matchId = req.query.id;
    const homeTeamName = req.query.homeTeamName;
    const awayTeamName = req.query.awayTeamName;
    let contestDisable = req.query.contestDisable;
    const userId = req.user.userId;
    let teamDetail = "undefined";

    try{
        const team = await Team.findOne({matchId : matchId , userId : userId});
        if(team){
            teamDetail = team;
        }
    }catch(err){
        console.log("Error : " + err);
    }

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
        let match = await MatchLiveDetail.findOne({matchId : matchId});  
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
                    wicketsSI : match.wicketsSI,
                    date : match.date
                }
            }
            let contests = await Contest.find({matchId : matchId});
            if(contests){
                for(let x of contests){
                    let totalPoolPrize = 0;
                    for(let i = 0; i < x.prizeDetails.length; i++){
                        totalPoolPrize += x.prizeDetails[i].prize;
                    }
                    if(x.admin == "server-domino-beton"){
                        let contestDet = {
                            contestId: x._id,
                            price : x.price,
                            totalSpots: x.totalSpots,
                            spotsLeft : x.spotsLeft,
                            teamsId : x.teamsId,
                            matchId : x.matchId,
                            prizeDetails : x.prizeDetails,
                            contestCode : "",
                            totalPoolPrize: totalPoolPrize
                        }
                        contestsDetails.push(contestDet);
                        continue;
                    }
                    for(let y of x.userIds){

                        if(y == userId){
                            let contestDet = {
                                contestId: x._id,
                                price : x.price,
                                totalSpots: x.totalSpots,
                                spotsLeft : x.spotsLeft,
                                teamsId : x.teamsId,
                                matchId : x.matchId,
                                prizeDetails : x.prizeDetails,
                                contestCode : x.id,
                                totalPoolPrize: totalPoolPrize
                            }
                            contestsDetails.push(contestDet);
                        }
                    }
                }
            }
            
            let user;
            user = await User.findOne({userId : userId});
            
            matchDet.results.push(s);

            return res.render('contest_card', {
                title: 'Contests',
                match_details: matchDet,
                homeTeamName: homeTeamName,
                awayTeamName: awayTeamName,
                lineupsOut: lineOut,
                matchId: matchId,
                contests: contestsDetails,
                teamDetail: teamDetail,
                userDetail:user,
                wallet : user.wallet,
                contestDisable: contestDisable
            });
        }else{
            req.flash('error','LineUps are not out yet!!');
            return res.redirect('back');
        }
    }catch(err){
        console.log("Error : " + err);
        return res.redirect('back');
    }
}


