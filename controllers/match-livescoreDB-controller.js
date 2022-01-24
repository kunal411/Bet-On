const request = require('request');
const MatchLiveDetail = require('../models/match_live_details');
const Contest = require('../models/contest');
const Teams = require('../models/team');
const User = require('../models/user');
const Match = require('../models/match');
const transaction = require('../controllers/transaction_details_controller');

function pointCalculator(runs, fours, sixes, strikeRate, wicket, economy){
    let totalPoints = runs + fours*1 + sixes*2 + 25*wicket;
    while(runs >= 50){
        totalPoints += 20;
        runs -= 50;
    }
    if(strikeRate < 100){
        totalPoints -= 10;
    }
    if(economy >= 12){
        totalPoints -= 10;
    }
    return totalPoints;
}

module.exports.addMatchLiveScoreDettoDb = async function(){
    let date= new Date();
    let endDate = date;
    let result;

    try{
        endDate.setDate(endDate.getDate() + 1);
        let matchList = await MatchLiveDetail.find({
            "match_date": {
                $gte: Date(date),
                $lt: Date(endDate)
            }
        });
        for(let i = 0; i < matchList.length; i++){
            let matchId = matchList[i].matchId;

            if(matchList[i].inPlay == "No"){
                continue;
            }
            
            if(matchList[i].result == "Yes"){
                // We can give reference in the model and then populate it, it will save much time!!
                let matchDet = await Match.findOne({matchId : matchId});

                let contestIdList = matchDet.contestId;
                for(let contestId of contestIdList){
                    const contest = await Contest.findOne({_id : contestId});
                    
                    if(contest){
                        if(!contest.prizeDetails[0].prizeHolder){
                            const numWinners = contest.numWinners;
                            const teamIds = contest.teamsId;
                            let teamsArray = [];
                            for(let teamId of teamIds){
                                const team = await Teams.findOne({teamId : teamId});
                                teamsArray.push(team);
                            }
                            teamsArray.sort(function(a, b){return b.points - a.points});
                            for(let i = 0; i < numWinners && i < teamsArray.length; i++){
                                contest.prizeDetails[i].prizeHolder = teamsArray[i].userId;
                                transaction.createTransaction(teamsArray[i].userId, "", contest.prizeDetails[i].prize, "won contest");
                                const user = await User.findOneAndUpdate({userId : teamsArray[i].userId},
                                    {$inc:{
                                        wallet : contest.prizeDetails[i].prize,
                                        numberOfContestWon : 1,
                                        totalAmountWon : contest.prizeDetails[i].prize
                                    }});
                            }
                            const updatedContest = await Contest.updateOne({_id : contestId}, {$set:{
                                prizeDetails : contest.prizeDetails
                            }})
                        }
                    }
                }
            }

            const options = {
                method: 'GET',
                url: `https://cricket-live-data.p.rapidapi.com/match/${matchId}`,
                headers: {
                'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com',
                'x-rapidapi-key': '2b909860edmsh5c0b119df2b0392p18cb35jsn3e8d627a0d59',
                useQueryString: true
                }
            };

            let promise = new Promise((resolve,reject) =>{
                request(options,function(error,response,body){
                    if (error){
                        reject(error);
                    }
                    // console.log(body)
                    let s = JSON.parse(body);
                    // console.log(s);
                    resolve(s);
                })
            });
            promise.then( async (s)=>{
                // Change to be done in if condition , this is only for code testing!!!
                if(s.results.live_details.match_summary.in_play == "Yes"){
                    let inPlay = "Yes";
                    let status = s.results.live_details.match_summary.status;
                    let toss = s.results.live_details.match_summary.toss;
                    let result = s.results.live_details.match_summary.result;
                    console.log('**********' + result);
                    
                    let title_fi = "";
                    let overs_fi = 0;
                    let runs_fi = 0;
                    let wickets_fi = 0;
                    let fow_fi = "";
                    let extrasDetails_fi = "";
                    let batting1 = [];
                    let bowling1 = [];
                    
                    if(s.results.live_details.scorecard.length > 0){
                        batting1 = s.results.live_details.scorecard[0].batting;
                        bowling1 = s.results.live_details.scorecard[0].bowling;
                        title_fi = s.results.live_details.scorecard[0].title;
                        overs_fi = s.results.live_details.scorecard[0].overs;
                        runs_fi = s.results.live_details.scorecard[0].runs;
                        wickets_fi = s.results.live_details.scorecard[0].wickets;
                        fow_fi = s.results.live_details.scorecard[0].fow;
                        extrasDetails_fi = s.results.live_details.scorecard[0].extras_detail;
                    }
                    
                    let title_si = "";
                    let overs_si = 0;
                    let runs_si = 0;
                    let wickets_si = 0;
                    let fow_si = "";
                    let extrasDetails_si = "";
                    let batting2 = [];
                    let bowling2 = [];
                    
                    if(s.results.live_details.scorecard.length > 1){
                        title_si = s.results.live_details.scorecard[1].title;
                        overs_si = s.results.live_details.scorecard[1].overs;
                        runs_si = s.results.live_details.scorecard[1].runs;
                        wickets_si = s.results.live_details.scorecard[1].wickets;
                        fow_si = s.results.live_details.scorecard[1].fow;
                        extrasDetails_si = s.results.live_details.scorecard[1].extras_detail;
                        batting2 = s.results.live_details.scorecard[1].batting;
                        bowling2 = s.results.live_details.scorecard[1].bowling;
                    }
                    
                    let title_ti = "";
                    let overs_ti = 0;
                    let runs_ti = 0;
                    let wickets_ti = 0;
                    let fow_ti = "";
                    let extrasDetails_ti = "";
                    let batting3 = [];
                    let bowling3 = [];
                    
                    if(s.results.live_details.scorecard.length > 2){
                        batting3 = s.results.live_details.scorecard[2].batting;
                        bowling3 = s.results.live_details.scorecard[2].bowling;
                        title_ti = s.results.live_details.scorecard[2].title;
                        overs_ti = s.results.live_details.scorecard[2].overs;
                        runs_ti = s.results.live_details.scorecard[2].runs;
                        wickets_ti = s.results.live_details.scorecard[2].wickets;
                        fow_ti = s.results.live_details.scorecard[2].fow;
                        extrasDetails_ti = s.results.live_details.scorecard[2].extras_detail;
                    }
                    
                    let title_fouri = "";
                    let overs_fouri = 0;
                    let runs_fouri = 0;
                    let wickets_fouri = 0;
                    let fow_fouri = "";
                    let extrasDetails_fouri = "";
                    let batting4 = [];
                    let bowling4 = [];
                    
                    if(s.results.live_details.scorecard.length > 3){
                        batting4 = s.results.live_details.scorecard[3].batting;
                        bowling4 = s.results.live_details.scorecard[3].bowling;
                        title_fouri = s.results.live_details.scorecard[3].title;
                        overs_fouri = s.results.live_details.scorecard[3].overs;
                        runs_fouri = s.results.live_details.scorecard[3].runs;
                        wickets_fouri = s.results.live_details.scorecard[3].wickets;
                        fow_fouri = s.results.live_details.scorecard[3].fow;
                        extrasDetails_fouri = s.results.live_details.scorecard[3].extras_detail;
                    }
                    
                    
                    
                    let teamHomePlayers = matchList[i].teamHomePlayers;
                    let teamAwayPlayers = matchList[i].teamAwayPlayers;
                    
                    let batting = batting1.concat(batting2);
                    let bowling = bowling1.concat(bowling2);
                    
                    for(let i=0;i<teamHomePlayers.length;i++){
                        let player = teamHomePlayers[i];
                        let playerId = player.playerId;
                        for(let batter of batting){
                            if(batter.player_id == playerId){
                                teamHomePlayers[i].runs = batter.runs;
                                teamHomePlayers[i].balls = batter.balls;
                                teamHomePlayers[i].fours = batter.fours;
                                teamHomePlayers[i].sixes = batter.sixes;
                                teamHomePlayers[i].strikeRate = batter.strike_rate;
                                teamHomePlayers[i].howOut = batter.how_out;
                                teamHomePlayers[i].batOrder = batter.bat_order;
                            }
                        }
                        for(let bowler of bowling){
                            if(bowler.player_id == playerId){
                                teamHomePlayers[i].overs = bowler.overs;
                                teamHomePlayers[i].maidens = bowler.maidens;
                                teamHomePlayers[i].runsConceded = bowler.runs_conceded;
                                teamHomePlayers[i].wickets = bowler.wickets;
                                teamHomePlayers[i].economy = bowler.economy;
                            }
                        }
                    }
                    
                    for(let i=0;i<teamAwayPlayers.length;i++){
                        let player = teamAwayPlayers[i];
                        let playerId = player.playerId;
                        for(let batter of batting){
                            if(batter.player_id == playerId){
                                teamAwayPlayers[i].runs = batter.runs;
                                teamAwayPlayers[i].balls = batter.balls;
                                teamAwayPlayers[i].fours = batter.fours;
                                teamAwayPlayers[i].sixes = batter.sixes;
                                teamAwayPlayers[i].strikeRate = batter.strike_rate;
                                teamAwayPlayers[i].howOut = batter.how_out;
                                teamAwayPlayers[i].batOrder = batter.bat_order;
                            }
                        }
                        for(let bowler of bowling){
                            if(bowler.player_id == playerId){
                                teamAwayPlayers[i].overs = bowler.overs;
                                teamAwayPlayers[i].maidens = bowler.maidens;
                                teamAwayPlayers[i].runsConceded = bowler.runs_conceded;
                                teamAwayPlayers[i].wickets = bowler.wickets;
                                teamAwayPlayers[i].economy = bowler.economy;
                            }
                        }
                        
                        // Function to be written to calculate the points
                        teamHomePlayers[i].points = pointCalculator(teamHomePlayers[i].runs, teamHomePlayers[i].fours, teamHomePlayers[i].sixes, teamHomePlayers[i].sixes, teamHomePlayers[i].wickets, teamHomePlayers[i].economy);
                        teamAwayPlayers[i].points = pointCalculator(teamAwayPlayers[i].runs, teamAwayPlayers[i].fours, teamAwayPlayers[i].sixes, teamAwayPlayers[i].sixes, teamAwayPlayers[i].wickets, teamAwayPlayers[i].economy);
                        
                        try{
                            const matchUpdate = await MatchLiveDetail.updateOne({matchId:matchId}, { $set : {
                                inPlay : inPlay,
                                status : status,
                                toss : toss,
                                result : result,
                                teamHomePlayers : teamHomePlayers,
                                teamAwayPlayers : teamAwayPlayers,
                                titleFI : title_fi,
                                oversFI : overs_fi,
                                wicketsFI : wickets_fi,
                                runFI : runs_fi,
                                fowFI : fow_fi,
                                extrasDetailFI : extrasDetails_fi,
                                titleSI : title_si,
                                oversSI : overs_si,
                                wicketsSI : wickets_si,
                                runSI : runs_si,
                                fowSI : fow_si,
                                extrasDetailSI : extrasDetails_si   
                            }})
                        }catch(err){
                            console.log("Error : " + err);
                        }
                    }
                }else{
                    let inPlay = "No";
                    try{
                        const matchUpdate = await MatchLiveDetail.updateOne({matchId:matchId}, { $set : {
                            inPlay : inPlay
                        }})
                    }
                    catch(err){
                        console.log("Error : " + err);
                    }
                }
            })
        }
    }
    catch(err){
        console.log("Error : " + err);
    }
}