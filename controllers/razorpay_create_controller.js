const Razorpay = require('razorpay');
const alert = require('alert');
const User = require('../models/user');

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
        console.log(order);
        res.json(order);
    })
}

module.exports.checkTransaction = async function(req, res){
    console.log(req.body);
    const userId = req.user.userId;
    try{
        let user = await User.findOne({userId : userId});
        razorpay.payments.fetch(req.body.razorpay_payment_id).then(async (paymentDocumentation) => {
            if(paymentDocumentation.status == 'captured'){
                if(user){
                    let walletAmount = Number(user.wallet);
                    walletAmount += cashAdded;
                    console.log('Wallet Amount is : ' + walletAmount);
                    let updatedUser = await User.updateOne({userId : userId}, {$set:{
                        wallet : walletAmount
                    }})
                    console.log(updatedUser);
                }
                alert('Transaction successfull');
            }
            else{
                alert('Transaction failed please try again')
            }
        })
    }catch(err){
        console.log('Error : ' + err);
    }
    res.redirect('http://localhost:8000/users/profile');
}