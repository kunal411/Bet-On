const request = require('request');
const MatchLiveDetail = require('../models/match_live_details');

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
            const options = {
                method: 'GET',
                url: `https://cricket-live-data.p.rapidapi.com/match/${matchId}`,
                headers: {
                'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com',
                'x-rapidapi-key': process.env.API_KEY,
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

                    let title_fi = s.results.live_details.scorecard[0].title;
                    let overs_fi = s.results.live_details.scorecard[0].overs;
                    let runs_fi = s.results.live_details.scorecard[0].runs;
                    let wickets_fi = s.results.live_details.scorecard[0].wickets;
                    let fow_fi = s.results.live_details.scorecard[0].fow;
                    let extrasDetails_fi = s.results.live_details.scorecard[0].extras_detail;

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
                    
                    let teamHomePlayers = matchList[i].teamHomePlayers;
                    let teamAwayPlayers = matchList[i].teamAwayPlayers;

                    let batting1 = s.results.live_details.scorecard[0].batting;
                    let batting = batting1.concat(batting2);

                    let bowling1 = s.results.live_details.scorecard[0].bowling;
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