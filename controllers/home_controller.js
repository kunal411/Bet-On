// const request = require('request');
const Matches = require('../models/match');
const LiveMatches = require('../models/match_live_details');
const User = require('../models/user');

module.exports.home = async function (req, res){
    if (!req.isAuthenticated()) {
        return res.redirect('http://localhost:8000/users/sign-in');
    } 
    const userId = req.user.userId;
    let userMatches = [];
    let userMatcesDetails = {
        "results": []
    }; 

    let liveMatchesDetails = {
        "results": []
    };

    let upcomingMatchesDetails = {
        "results": []
    };

    let pastMatchesDetails = {
        "results": []
    };
    try{
        let user = await User.findOne({userId : userId});
        if(user){
            userMatches = user.matchIds;
        }
    }catch(err){
        console.log('Error : ' + err);
    }

    for(let x of userMatches){
        let match = await Matches.findOne({matchId : x});
        let match_det = await LiveMatches.findOne({matchId : x});

        if(match_det){
            let mat = {
                match_title : match.matchTitle,
                home: {
                    name : match.teamHomeName,
                    code: match.teamHomeCode.toUpperCase()
                }, 
                away: {
                    name : match.teamAwayName,
                    code: match.teamAwayCode.toUpperCase()
                },
                date: match.date,
                id: match.matchId,
                livestatus : "",
                result: "",
                status: "",
                inPlay: ""
            }
            mat.status = match_det.status;
            mat.inPlay = match_det.inPlay;
            liveStatus = "Line-ups are out!";
            mat.livestatus = liveStatus;
            if(match_det.result == "No"){
                mat.result = "No";
            }
            else{
                mat.result = "Yes";
            }
            userMatcesDetails.results.push(mat);
        }
    }

    try{
        let date=new Date();
        date.setDate(date.getDate() - 1);
        let startDate = date.toISOString();
        date.setDate(date.getDate() + 6);
        let endDate = date.toISOString();
        let matchList = await Matches.find({
            "match_date": {
            $gte: Date(startDate),
            $lt: Date(endDate),
        } 
        });
        for(let i = 0; i < matchList.length; i++){
            let liveStatus="";
            try{
                let match = await LiveMatches.findOne({matchId : matchList[i].matchId});
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
                    livestatus : "",
                    result: "",
                    status: "",
                    inPlay: ""

                }
                if(match){
                    mat.status = match.status;
                    mat.inPlay = match.inPlay;
                    liveStatus = "Line-ups are out!";
                    mat.livestatus = liveStatus;
                    if(match.result == "No"){
                        mat.result = "No";
                        liveMatchesDetails.results.push(mat);
                    }
                    else{
                        mat.result = "Yes";
                        pastMatchesDetails.results.push(mat);
                    }
                }else {
                    liveStatus = "Line-ups are not out yet!";
                    mat.livestatus = liveStatus;
                    upcomingMatchesDetails.results.push(mat);
                }
                console.log(liveStatus);
            }catch(err){
                console.log("Error : " + err);
            }
        }
        console.log(userMatches);
        return res.render('match_card', {
            title: 'Home Page',
            currDate: new Date(),
            userMatches: userMatcesDetails,
            upcomingMatchesDetails: upcomingMatchesDetails,
            pastMatchesDetails: pastMatchesDetails,
            liveMatchesDetails: liveMatchesDetails
        })
    }catch(err){
        console.log("Error : " + err);
    }
}