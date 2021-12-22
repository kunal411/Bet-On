const Match = require('../models/match');
const request = require('request');
const MatchLiveDetail = require('../models/match_live_details');

// module.exports.addMatchLiveDettoDb = function(){

//     let date= new Date();
//     let endDate = date;
//     endDate.setDate(endDate.getDate() + 1);
//     Match.find({"match_date": {
//         $gte: Date(date),
//         $lt: Date(endDate),}}, function(err, matchList){

//             if(err){
//                 console.log('Error in fetching Matches from DB');
//                 return;
//             }

//             for(let i = 0; i < matchList.length; i++){
//                 const matchId = matchList[i].matchId;
//                 MatchLiveDetail.findOne({matchId : matchId}, function(err , match){
//                     if(err){
//                         console.log('Error in finding match id ');
//                         return;
//                         // return res.redirect('http://localhost:8000/users/sign-up');
//                     }
                    
//                     if(match){
//                         console.log('Match already exist in database! ');
//                     }
//                     else{
//                         const date1 = matchList[i].date;
//                         if((date1 - date)/(60 * 1000) <= 30){
//                             const options = {
//                                 method: 'GET',
//                                 url: `https://cricket-live-data.p.rapidapi.com/match/${matchId}`,
//                                 headers: {
//                                 'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com',
//                                 'x-rapidapi-key': process.env.API_KEY,
//                                 useQueryString: true
//                                 }
//                             }; 
//                             let matchDet = {
//                                 "results": []
//                             };
//                             request(options, function (error, response, body) {
//                                 if (error) throw new Error(error);
//                                 let s = JSON.parse(body);
//                                 // console.log(s);
//                                 if(s.results.live_details != null && s.results.live_details.teamsheets.home.length != 0){
//                                     let LiveMatchDet = new MatchLiveDetail();
//                                     LiveMatchDet.matchId = matchId;
//                                     for(let x of s.results.live_details.teamsheets.home){
//                                         if(x.position == 'Unknown'){
//                                             x.position = 'Batsman';
//                                         }
//                                         let playerDet = {
//                                             playerId : x.player_id, 
//                                             playerName : x.player_name,
//                                             points : 4,
//                                             position: x.position
//                                         }
//                                         // console.log(matchId+" "+playerDet.playerId+" "+playerDet.playerName+" "+playerDet.position);
//                                         LiveMatchDet.teamHomePlayers.push(playerDet);
//                                     }

//                                     for(let x of s.results.live_details.teamsheets.away){
//                                         if(x.position == 'Unknown'){
//                                             x.position = 'Batsman';
//                                         }
//                                         let playerDet = {
//                                             playerId : x.player_id, 
//                                             playerName : x.player_name,
//                                             points : 4,
//                                             position: x.position
//                                         }
//                                         // console.log(matchId+" "+playerDet.playerId+" "+playerDet.playerName+" "+playerDet.position);
//                                         LiveMatchDet.teamAwayPlayers.push(playerDet);
//                                     }
            
//                                     MatchLiveDetail.create(LiveMatchDet,function(err,match){
//                                         if(err){
//                                             console.log('Error in creating match while putting in db', err);
//                                         }
//                                         else{
//                                             console.log('Live Details of match is successfully added in db! ');
//                                         }
//                                     });
//                                 }
                                
//                             });
                            
//                         }
//                     }
//                 });
//             }
//     });
// }

// THIS SHOULD BE DONE INSTEAD OF THE ABOVE ONE !!

module.exports.addMatchLiveDettoDb = async function(){
    let date= new Date();
    let endDate = date;

    try{
        endDate.setDate(endDate.getDate() + 1);
        let matchList = await Match.find({
            // "match_date": {
            //     $gte: Date(date),
            //     $lt: Date(endDate)
            // }
        });
        for(let i = 0; i < matchList.length; i++){
            const matchId = matchList[i].matchId;

            try{
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
                        'x-rapidapi-key': process.env.API_KEY,
                        useQueryString: true
                        }
                    }; 
                    let matchDet = {
                        "results": []
                    };
                    // Doubt in this part !!!!!!!!!!
                    let promise = new Promise((resolve,reject) =>{
                        if((date1 - date)/(60 * 1000) <= 30){
                            request(options,function(error,response,body){
                                if (error){
                                    reject(error);
                                }
                                // console.log(body)
                                let s = JSON.parse(body);
                                // console.log(s);
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
                                // console.log(matchId+" "+playerDet.playerId+" "+playerDet.playerName+" "+playerDet.position);
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
                                // console.log(matchId+" "+playerDet.playerId+" "+playerDet.playerName+" "+playerDet.position);
                                LiveMatchDet.teamAwayPlayers.push(playerDet);
                            }
                            try{
                                let match = await MatchLiveDetail.create(LiveMatchDet);
                                if(match){
                                    console.log('Live Details of match is successfully added in db! ');
                                }
                            }
                            catch(err){
                                console.log("Error 1 : " + err);
                            }
                        }
                    }).catch((error)=>{
                        console.log("Error 2 : " + error);
                    })
                }
            }catch(err){
                console.log("Error 3 : " + err);
            }
        }
    }catch(err){
        console.log("Error 4 : " + err);
    }
}

