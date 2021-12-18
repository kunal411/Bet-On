const Match = require('../models/match');
const request = require('request');

module.exports.dbConnectioCheck = function(){
    function pad2(n) { 
        return (n < 10 ? '0' : '') + n;
    }
      
    let obj = {
        "results" : []
    };
    var date = new Date(); 
    const date1 = new Date();
    var month = pad2(date.getMonth()+1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year= date.getFullYear(); 
    var formattedDate =  year+"-"+month+"-"+day;
    for (let i = 0; i < 5; i++) {
        console.log(formattedDate);
        
        const options = {
            method: 'GET',
            url: `https://cricket-live-data.p.rapidapi.com/fixtures-by-date/${formattedDate}`,
            headers: {
            'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com',
            'x-rapidapi-key': process.env.API_KEY,
            useQueryString: true 
            }  
        };
        
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let s = JSON.parse(body);
            // console.log(s);
            for(mat of s.results){
            obj.results.push(mat);
            }
            if(i==4){
                
                for(let i=0;i<5;i++){
                    var match1 = new Match();
                    const matchId = obj.results[i].id;
                    match1.matchId = matchId;
                    match1.teamHomeName = obj.results[i].home.name;
                    match1.teamAwayName = obj.results[i].away.name;
                    if(obj.results[i].home.code == ""){
                        match1.teamHomeCode = obj.results[i].home.name.substr(0,3).toUpperCase;
                    }else{

                        match1.teamHomeCode = obj.results[i].home.code;
                    }
                    if(obj.results[i].away.code == ""){
                        match1.teamAwayCode = obj.results[i].away.name.substr(0,3).toUpperCase;
                    }else{
                        match1.teamAwayCode = obj.results[i].away.code;
                    }

                    Match.findOne({mathId : matchId}, function(err , match){
                        if(err){
                            console.log('Error in finding match id ');
                            return;
                            // return res.redirect('http://localhost:8000/users/sign-up');
                        }
                        
                        if(!match){
                            Match.create(match1,function(err,match){
                                if(err){
                                    console.log('Error in creating match while putting in db', err);
                                    return;
                                    // return res.redirect('back');
                                }
                                console.log('match is successfully added in db! ');
                                return;
                                // return res.redirect('http://localhost:8000/users/sign-in');
                            });
                        }else{
                            // alert('Email id already exists')
                            console.log('Match already exist in database! ');
                            return;
                            // return res.redirect('http://localhost:8000/users/sign-in');
                        }
                    });
                    
                }
                
            }
        });
        date = new Date(date.getTime() + (24 * 60 * 60 * 1000));
        var month = pad2(date.getMonth()+1);//months (0-11)
        var day = pad2(date.getDate());//day (1-31)
        var year= date.getFullYear();
        formattedDate =  year+"-"+month+"-"+day;
        
    }
}