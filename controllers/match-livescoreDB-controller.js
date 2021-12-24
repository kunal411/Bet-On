const request = require('request');
const MatchLiveDetail = require('../models/match_live_details');

module.exports.addMatchLiveScoreDettoDb = async function(){
    let date= new Date();
    let endDate = date;

    try{
        endDate.setDate(endDate.getDate() + 1);
        let matchList = await MatchLiveDetail.find({
            // "match_date": {
            //     $gte: Date(date),
            //     $lt: Date(endDate)
            // }
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
                if(s.results.live_details.match_summary.in_play == "No"){
                    let inPlay = "Yes";
                    let status = s.results.live_details.match_summary.status;
                    let toss = s.results.live_details.match_summary.toss;
                    let result = s.results.live_details.match_summary.result;

                    let teamHomePlayers = matchList[i].teamHomePlayers;
                    let teamAwayPlayers = matchList[i].teamAwayPlayers;

                    let batting1 = s.results.live_details.scorecard[0].batting;
                    let batting2 = s.results.live_details.scorecard[1].batting;
                    let batting = batting1.concat(batting2);

                    let bowling1 = s.results.live_details.scorecard[0].bowling;
                    let bowling2 = s.results.live_details.scorecard[1].bowling;
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
                            }
                        }
                        for(let bowler of bowling){
                            if(bowler.player_id == playerId){
                                teamHomePlayers[i].overs = bowler.overs;
                                teamHomePlayers[i].maidens = bowler.maidens;
                                teamHomePlayers[i].runsConceded = bowler.runs_conceded;
                                teamHomePlayers[i].wickets = bowler.wickets;
                                teamHomePlayers[i].economy = bowler.economy;
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
                        teamHomePlayers[i].points = 0;
                        teamAwayPlayers[i].points = 0;

                        const matchUpdate = await MatchLiveDetail.updateOne({matchId:matchId}, { $set : {
                            inPlay : inPlay,
                            status : status,
                            toss : toss,
                            result : result,
                            teamHomePlayers : teamHomePlayers,
                            teamAwayPlayers : teamAwayPlayers

                        }})
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