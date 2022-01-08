const User = require('../models/user');
var request = require('request');
const alert = require('alert');

module.exports.profile = async function(req, res){
    const userId = req.user.userId;
    let user;
    try{
        user = await User.findOne({userId: userId});
    }catch(err){
        console.log('Error : ' + err);
    }


    return res.render('user_profile',{
        title: 'My profile',
        userId: userId,
        userIdDB: user._id,
        numberOfContestJoined: user.numberOfContestJoined,
        totalAmountWon: user.totalAmountWon,
        numberOfContestWon: user.numberOfContestWon,
        numberOfTeamsCreated: user.numberOfTeamsCreated,
        wallet: user.wallet,
        accountNumber: user.accountNumber,
        ifsc: user.ifsc
    });
}

module.exports.addAccount = async function(req, res){
    const accountNumber = req.body.accountNumber;
    const ifsc = req.body.ifsc;
    console.log(ifsc);
    console.log(accountNumber);
    const userId = req.user.userId;
    try{
        var options = {
            'method': 'POST',
            'url': 'https://api.razorpay.com/v1/fund_accounts',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Basic cnpwX3Rlc3RfT0N0MTBGeGpuWFROV0s6RlpyNW9YQjFCWnFtbDBhUlRhd0IwSUh1'
            },
            body: JSON.stringify({
                "contact_id": req.user.contact_id,
                "account_type": "bank_account",
                "bank_account": {
                "name": req.user.name,
                "ifsc": ifsc,
                "account_number": accountNumber
                }
            })
        };
        let fundId;
        let promise = new Promise((resolve,reject) =>{
            request(options, function (error, response) {
                if (error) reject(error);
                let s = JSON.parse(response.body);
                console.log(response.body);
                fundId = s.id;
                resolve();
            });
        });
        promise.then( async ()=>{
            let user = await User.updateOne({userId: userId}, {$set : {
                accountNumber : accountNumber,
                ifsc : ifsc,
                fundId : fundId
            }});
            alert('Account Added Successfully')
        }).catch((err)=>{
            console.log("Error : " + err);
        })
    }catch(err){
        console.log('Error : ' + err);
    }
    return res.redirect('back');
    
}