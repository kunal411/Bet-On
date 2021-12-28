const MatchLiveDetail = require('../models/match_live_details');
const Teams = require('../models/team');

module.exports.scoreUpdate = async function(){
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
            try{
                let teams = await Teams.find({matchId: matchId});
                for(let a = 0; a < teams.length; a++){
                    if(teams[a]){ 
                        let playersDetails1 = matchList[i].teamHomePlayers;
                        let playersDetails2 = matchList[i].teamAwayPlayers;
                        let playersDetails = playersDetails1.concat(playersDetails2);
                        let players = teams[a].players;
                        let points = 0;
                        for(let x = 0; x < players.length; x++){
                            let playerId = players[x].playerId;
                            for(let y of playersDetails){
                                if(playerId == y.playerId){
                                    points += y.points;
                                    players[x].point = y.points;
                                    if(playerId == teams[a].captainId){
                                        points += y.points;
                                        players[x].point += y.points;
                                    }
                                    if(playerId == teams[a].captainId){
                                        points += (0.5 * y.points);
                                        players[x].point += (0.5 * y.points);
                                    }
                                }
                            }
                        }
                        try{
                            const updatedTeam = await Teams.updateOne({teamId:teams[a].teamId}, { $set : {
                                points:points,
                                players:players
                            }})
                        }catch(err){
                            console.log('Error : ' + err);
                        }
                    }
                }
            }
            catch(err){
                console.log('Error : ' + err);
            }
        }
    }
    catch(err){
        console.log('Error : ' + err);
    }
}