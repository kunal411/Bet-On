// const request = require('request');
const { matchedData } = require('express-validator');
const Matches = require('../models/match');
module.exports.home = function (req, res) {
    
    
    // function pad2(n) {
    //     return (n < 10 ? '0' : '') + n;
    // }
    // let obj = {
    //     "results": []
    // };
    // var date = new Date();
    // const date1 = new Date();
    // var month = pad2(date.getMonth() + 1);//months (0-11)
    // var day = pad2(date.getDate());//day (1-31)
    // var year = date.getFullYear();
    // var formattedDate = year + "-" + month + "-" + day;
    // for (let i = 0; i < 5; i++) {
    //     console.log(formattedDate);
    //     const options = {
    //         method: 'GET',
    //         url: `https://cricket-live-data.p.rapidapi.com/fixtures-by-date/${formattedDate}`,
    //         headers: {
    //             'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com',
    //             'x-rapidapi-key': process.env.API_KEY,
    //             useQueryString: true
    //         }
    //     };
    //     request(options, function (error, response, body) {
    //         if (error) throw new Error(error);
    //         let s = JSON.parse(body);
    //         // console.log(s);
    //         for (mat of s.results) {
    //             obj.results.push(mat);
    //         }
    //         if (i == 4) {
    //             return res.render('match_card', {
    //                 title: 'Home Page',
    //                 matches: obj,
    //                 currDate: date1
    //             })
    //         }
    //     });
    //     date = new Date(date.getTime() + (24 * 60 * 60 * 1000));
    //     var month = pad2(date.getMonth() + 1);//months (0-11)
    //     var day = pad2(date.getDate());//day (1-31)
    //     var year = date.getFullYear();
    //     formattedDate = year + "-" + month + "-" + day;
    // }

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
                id: matchList[i].matchId
            }
            obj.results.push(mat);
        }
        return res.render('match_card', {
            title: 'Home Page',
            matches: obj,
            currDate: new Date()
        })

    })
}