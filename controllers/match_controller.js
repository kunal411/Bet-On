const request = require('request');

module.exports.contest = function(req,res){
    const match_id = req.query.id;
    const homeTeamName = req.query.homeTeamName;
    const awayTeamName = req.query.awayTeamName;
    const options = {
        method: 'GET',
        url: `https://cricket-live-data.p.rapidapi.com/match/${match_id}`,
        headers: {
        'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com',
        'x-rapidapi-key': process.env.API_KEY,
        useQueryString: true
        }
    }; 
    let matchDet = {
        "results": []
    };
    let s;
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let s = JSON.parse(body);
        // console.log(s);
        matchDet.results.push(s.results);
        return res.render('contest_card', {
        title: 'Contests',
        match_details: matchDet,
        homeTeamName: homeTeamName,
        awayTeamName: awayTeamName
        })
    });
}