// const request = require('request');
const { matchedData } = require('express-validator');
const Matches = require('../models/match');
const LiveMatches = require('../models/match_live_details');

module.exports.home = async function (req, res){
    if (!req.isAuthenticated()) {
        return res.redirect('http://localhost:8000/users/sign-in');
    } 
    try{
        let obj = {
            "results": []
        }; 
        let date=new Date();
        date.setDate(date.getDate() - 1);
        let startDate = date.toISOString();
        date.setDate(date.getDate() + 6);
        let endDate = date.toISOString();
        let matchList = await Matches.find({
             // "match_date": {
            // $gte: Date(startDate),
            // $lt: Date(endDate),
        // } 
        });
        for(let i = 0; i < matchList.length; i++){
            let liveStatus="";
            try{
                let match = await LiveMatches.findOne({matchId : matchList[i].matchId});
                if(match){
                    liveStatus = "Line-ups are out!";
                }else {
                    liveStatus = "Line-ups are not out yet!";
                }
                console.log(liveStatus);
                let mat = {
                    match_title : matchList[i].matchTitle,
                    home: {
                        name : matchList[i].teamHomeName,
                        code: matchList[i].teamHomeCode.toUpperCase()
                    }, 
                    away: {
                        name : matchList[i].teamAwayName,
                        code: matchList[i].teamAwayCode.toUpperCase()
                    },
                    date: matchList[i].date,
                    id: matchList[i].matchId,
                    status : liveStatus
                }
                obj.results.push(mat);
            }catch(err){
                console.log("Error : " + err);
            }
        }
        return res.render('match_card', {
            title: 'Home Page',
            matches: obj,
            currDate: new Date()
        })
    }catch(err){
        console.log("Error : " + err);
    }
}