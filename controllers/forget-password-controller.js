const User = require('../models/user');

const jwt = require('jsonwebtoken');
let alert = require('alert'); 
const messageBird = require('messagebird')('tkHcvInDskcXMVonVdf7aQKD9');
const activatekey = 'accountactivatekey123';
const clientURL = 'http://localhost:8000';

const mailGunKey = '2369118d8afc76b7633587ac90dbb9d3-cac494aa-f03797ca';
const domain = 'sandbox3ca088a06dd44d33a56243753edb1f64.mailgun.org';

const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: mailGunKey , domain: domain});

module.exports.forgetPassword = function(req,res){
    return res.render('forget_password', {
        title: 'domino-beton || Forget Password'    
    });
}

module.exports.resetPassword = async function(req,res){
    const email = req.body.email;
    const phone = req.body.phone;
    const verify = req.body.verify;

    try{
        const user = await User.findOne({email:email,phone:phone});
        if(user){
            if(verify == 'EMAIL'){
                const token = jwt.sign({email, phone},activatekey,{expiresIn : '20m'});

                const data = {
                    from: 'noreply@student.com',
                    to: req.body.email,
                    subject: 'Account Reset Key',
                    html : `
                        <h2>Please click  on below link to reset your account</h2>
                        <a href="${clientURL}/authentication/reset?token=${token}">CLICK HERE</a>
                    `
                };
                mg.messages().send(data, function (error, body) {
                    if(error){
                        alert('Something went wrong, please sign-up again');
                        console.log(error.message);
                        return res.redirect('baack');
                    }
                    console.log('Email has been sent for verification');
                    alert('Email has been sent for verification, please veirfy');
                    return res.redirect('sign-in');    
                });

            }else{
                var number = phone;
                messageBird.verify.create(number, {
                    template: "Your Verification code is %token."
                }, function(err, resp){
                    if(err){
                        alert('Something went wrong, please sign-up again');
                        console.log(err);
                        return res.redirect('back');
                    }
                    else{
                        var ph, em;
                        em = Buffer.from(email).toString('base64');
                        ph = Buffer.from(phone).toString('base64');
                        console.log(resp);
                        return res.render('otp-auth', {
                            title: "Verify OTP",
                            email: em,
                            phone: ph,
                            id: resp.id
                        });
                    }
                });
            }
        }else {
            alert('User not found!!');
            return res.redirect('back');
        }

    }catch(err){
        console.log('Error : ' + err);
    }
    return res.redirect('back');
}

module.exports.resetAccount = function(req,res){
    const token = req.query.token;
    console.log(token);
    if(token){
        jwt.verify(token,activatekey, function(err, decodedToken){
            if(err){
                console.log('Incorrect or expire link');
                return res.redirect('http://localhost:8000/users/sign-in');
            }
            const{email, phone} = decodedToken;
            return res.render('reset_password', {
                title: 'domino-beton || Reset Password',
                email : email,
                phone : phone
            });
        });
    }else{
        alert('Something went wrong, please sign-up again');
        console.log('Something went wrong!!');
        return res.redirect('http://localhost:8000/users/sign-in');
    }
}

module.exports.restPasswordIndb = function(req,res){
    
}