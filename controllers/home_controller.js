const request = require('request');
module.exports.home = function (req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect('http://localhost:8000/users/sign-in');
    }
    function pad2(n) {
        return (n < 10 ? '0' : '') + n;
    }
    let obj = {
        "results": []
    };
    var date = new Date();
    const date1 = new Date();
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var formattedDate = year + "-" + month + "-" + day;
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
            for (mat of s.results) {
                obj.results.push(mat);
            }
            if (i == 4) {
                return res.render('match_card', {
                    title: 'Home Page',
                    matches: obj,
                    currDate: date1
                })
            }
        });
        date = new Date(date.getTime() + (24 * 60 * 60 * 1000));
        var month = pad2(date.getMonth() + 1);//months (0-11)
        var day = pad2(date.getDate());//day (1-31)
        var year = date.getFullYear();
        formattedDate = year + "-" + month + "-" + day;
    }
}