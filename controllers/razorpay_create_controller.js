const User = require('../models/user');
const Razorpay = require('razorpay');
var request = require('request');

const transaction = require('../controllers/transaction_details_controller');

const razorpay = new Razorpay({
    key_id: 'rzp_test_OCt10FxjnXTNWK',
    key_secret: 'FZr5oXB1BZqml0aRTawB0IHu'
})

var cashAdded;

module.exports.addCashInfo = function(req, res){
    cashAdded = Number(req.query.amount);
    let options = {
        amount: req.query.amount * 100,
        currency : "INR",
        receipt : "order_receipt_11"
    }

    razorpay.orders.create(options, (err, order) =>{
        res.json(order);
    })
}

module.exports.checkTransaction = async function(req, res){
    console.log(req.body);
    const userId = req.user.userId;
    try{
        razorpay.payments.fetch(req.body.razorpay_payment_id).then(async (paymentDocumentation) => {
            if(paymentDocumentation.status == 'captured'){
                let updatedUser = await User.updateOne({userId : userId}, {$inc:{
                    wallet : cashAdded
                }})
                transaction.createTransaction(userId, req.body.razorpay_payment_id, cashAdded, "cash added");
                req.flash('success','Transaction successfull');
                res.redirect(`/users/profile/${req.user.userId}`);
            }
            else{
                req.flash('error','Transaction failed please try again');
                res.redirect(`/users/profile/${req.user.userId}`);
            }
        })
    }catch(err){
        console.log('Error : ' + err);
        res.redirect(`/users/profile/${req.user.userId}`);
    }
}

module.exports.withdrawCash = async function(req, res){
    const amount = req.query.amount
    const userId = req.user.userId;
    const leftAmount = req.user.wallet - amount;
    try{
        let user = await User.findOne({userId : userId});
        if(!user.accountNumber){
            req.flash('error','Add Bank Details');
            res.json();
        }
        else if(leftAmount < 0){
            req.flash('error','Not enough balance');
            res.json();
        }
        else{
            var options = {
                'method': 'POST',
                'url': 'https://api.razorpay.com/v1/payouts',
                'headers': {
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic cnpwX3Rlc3RfT0N0MTBGeGpuWFROV0s6RlpyNW9YQjFCWnFtbDBhUlRhd0IwSUh1'
                },
                body: JSON.stringify({
                  "account_number": '2323230045564191',
                  "fund_account_id": user.fundId,
                  "amount": amount * 100,
                  "currency": "INR",
                  "mode": "IMPS",
                  "purpose": "refund",
                  "queue_if_low_balance": true,
                  "reference_id": "Acme Transaction ID 12345",
                  "narration": "Acme Corp Fund Transfer",
                  "notes": {
                    "notes_key_1": "Tea, Earl Grey, Hot",
                    "notes_key_2": "Tea, Earl Grey… decaf."
                  }
                })
              
              };
            let promise = new Promise((resolve,reject) =>{
                request(options, function (error, response) {
                    if (error) reject(error);
                    console.log(response.body);
                    let s = JSON.parse(response.body);
                    resolve(s);
                });
            });

            promise.then( async (s)=>{
                if(s.failure_reason == null){
                    console.log(leftAmount);
                    transaction.createTransaction(userId, s.utr, amount, "cash withdraw");
                    await User.updateOne({userId : userId}, {$set :{
                        wallet : leftAmount
                    }})
                    req.flash('success', 'Withdrawal Successful');
                    res.json();
                }
            }).catch((err)=>{
                console.log("Error : " + err);
            })
        }
    }catch(err){
        console.log('Error : ' + err);
    }
}