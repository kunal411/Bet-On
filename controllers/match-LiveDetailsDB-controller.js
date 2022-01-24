// Imported all required Schema.
const Match = require('../models/match');
const MatchLiveDetail = require('../models/match_live_details');

const request = require('request');

module.exports.addMatchLiveDettoDb = async function(){
    let date= new Date();
    let endDate = date;

    try{
        endDate.setDate(endDate.getDate() + 1);
        let matchList = await Match.find({
            "match_date": {
                $gte: Date(date),
                $lt: Date(endDate)
            }
        });
        for(let i = 0; i < matchList.length; i++){
            const matchId = matchList[i].matchId;

            let match = await MatchLiveDetail.findOne({matchId : matchId});
            if(match){
                console.log('Match already exist in database! ');
            }else{
                const date1 = matchList[i].date;
                const options = {
                    method: 'GET',
                    url: `https://cricket-live-data.p.rapidapi.com/match/${matchId}`,
                    headers: {
                    'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com',
                    'x-rapidapi-key': '2b909860edmsh5c0b119df2b0392p18cb35jsn3e8d627a0d59',
                    useQueryString: true
                    }
                }; 
                let matchDet = {
                    "results": []
                };
                
                let promise = new Promise((resolve,reject) =>{
                    if((date1 - date)/(60 * 1000) <= 30){
                        request(options,function(error,response,body){
                            if (error){
                                reject(error);
                            }
                            let s = JSON.parse(body);
                            resolve(s);
                        })
                    }else{
                        reject('Lineups not out before 30 minutes...');
                    }
                });
                promise.then( async (s)=>{
                    if(s.results.live_details != null && s.results.live_details.teamsheets.home.length != 0){
                        let LiveMatchDet = new MatchLiveDetail();
                        LiveMatchDet.matchId = matchId;
                        LiveMatchDet.date = date1;
        
                        for(let x of s.results.live_details.teamsheets.home){
                            if(x.position == 'Unknown'){
                                x.position = 'Batsman';
                            }
                            let playerDet = {
                                playerId : x.player_id, 
                                playerName : x.player_name,
                                points : 4,
                                position: x.position
                            }
                            LiveMatchDet.teamHomePlayers.push(playerDet);
                        }
        
                        for(let x of s.results.live_details.teamsheets.away){
                            if(x.position == 'Unknown'){
                                x.position = 'Batsman';
                            }
                            let playerDet = {
                                playerId : x.player_id, 
                                playerName : x.player_name,
                                points : 4,
                                position: x.position
                            }
                            LiveMatchDet.teamAwayPlayers.push(playerDet);
                        }
                        
                        let match = await MatchLiveDetail.create(LiveMatchDet);
                        if(match){
                            console.log('Live Details of match is successfully added in db! ');
                        }
                        
                    }
                }).catch((error)=>{
                    console.log("Error 2 : " + error);
                })
            }
        }
    }catch(err){
        console.log("Error 4 : " + err);
    }
}

