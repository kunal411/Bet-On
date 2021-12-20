// const request = require('request');
const { matchedData } = require('express-validator');
const Matches = require('../models/match');
const LiveMatches = require('../models/match_live_details');
module.exports.home = function (req, res) {
   

    if (!req.isAuthenticated()) {
        return res.redirect('http://localhost:8000/users/sign-in');
    }   
    let obj = {
        "results": []
    }; 
    let date=new Date();
    date.setDate(date.getDate() - 1);
    let startDate = date.toISOString();
    date.setDate(date.getDate() + 6);
    let endDate = date.toISOString();
    Matches.find({"match_date": {
        $gte: Date(startDate),
        $lt: Date(endDate),}}, function(err, matchList){
        if(err){
            console.log('Error in fetching Matches from DB');
            return;
        }

        for(let i = 0; i < matchList.length; i++){
            // console.log('iteration number : '+ i);
            let liveStatus="";
            LiveMatches.findOne({matchId : matchList[i].matchId}, function(err,match){
                if(err){
                    liveStatus = "Error, Cannot find the details of this match!!"
                    // console.log('Error in finding live match in database!!');
                }else if(match){
                    liveStatus = "Line-ups are out!";
                }else{
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
                if(i==matchList.length-1){
                    return res.render('match_card', {
                        title: 'Home Page',
                        matches: obj,
                        currDate: new Date()
                    })
                }
            })
        }

    })
}