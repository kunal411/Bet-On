const User = require('../models/user');

const jwt = require('jsonwebtoken');
let alert = require('alert'); 
const messageBird = require('messagebird')('W2tTRdqV8xxNjMYhIXSX3eEY6');
const activatekey = 'accountactivatekey123';
const clientURL = 'http://localhost:8000';

const mailGunKey = '5d5399a434023a5c229e7a1e1a80d493-cac494aa-586b59e2';
const domain = 'sandbox11a51a4bfd9245d587c2b8a6d188b1fd.mailgun.org';

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
    let ph, em;
    let tokenId = false;
    const user = await User.findOne({email:email,phone:phone});
    if(user){
        if(verify == 'EMAIL'){
            const token = jwt.sign({email, phone},activatekey,{expiresIn : '2m'});

            const data = {
                from: 'noreply@student.com',
                to: req.body.email,
                subject: 'Account Reset Key',
                html : `
                    <h2>Please click  on below link to reset your account</h2>
                    <a href="${clientURL}/authentication/reset?token=${token}">CLICK HERE</a>
                `
            };
            await mg.messages().send(data,function (error, body) {
                if(error){
                    alert('Something went wrong, please sign-up again');
                    console.log(error.message);
                    return res.redirect('back');
                }
                console.log('Email has been sent for verification for forget password');
                alert('Email has been sent for verification, please veirfy');
            });

        }else{
            var number = phone;
            await messageBird.verify.create(number, {
                template: "Your Verification code is %token."
            }, function(err, resp){
                if(err){
                    alert('Something went wrong, please sign-up again');
                    console.log(err);
                    return res.redirect('back');
                }
                else{
                    em = Buffer.from(email).toString('base64');
                    ph = Buffer.from(phone).toString('base64');
                    tokenId = resp.id;
                    console.log(resp);
                    return res.render('otp-auth-forget-password', {
                        title: "Verify OTP",
                        email: em,
                        phone: ph,
                        id: tokenId
                    });
                }
            });
        }
    }else {
        alert('User not found!!');
        return res.redirect('back');
    }
}

module.exports.otp = function(req, res){
    var id = req.body.id;
    var token = req.body.token;
    var email = Buffer.from(req.body.email, 'base64').toString();
    var phone = Buffer.from(req.body.phone, 'base64').toString();
    console.log(email, phone);

    messageBird.verify.verify(id, token, function(err, response){
        if(err){
            var ph, em;
            em = Buffer.from(email).toString('base64');
            ph = Buffer.from(phone).toString('base64');
            console.log(err);
            console.log("id is ", id);
            console.log("token is ", token);
            alert('OTP entered is incorrect');
            res.redirect('http://localhost:8000/users/sign-up')
        }
        else{
            return res.render('reset_password', {
                title: 'domino-beton || Reset Password',
                email : email,
                phone : phone
            });
        }
    });
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
        alert('Something went wrong, please try again');
        console.log('Something went wrong!!');
        return res.redirect('http://localhost:8000/users/sign-in');
    }
}

module.exports.restPasswordIndb = async function(req,res){
    const email = req.body.email;   
    let password = req.body.password;   
    const confirmPassword = req.body.confirmPassword;   
    const phone = req.body.phone;   

    if(confirmPassword != password){
        alert('Password and confrim-password should be same!');
        return res.redirect('back');
    }
    try{
        password = Buffer.from(password).toString('base64');
        const user = await User.updateOne({email : email},{$set : {
            password : password
        }});
        alert('Password reset successfully!!');
        return res.redirect('http://localhost:8000/users/sign-in');
    }catch(err){
        console.log("Error : " + err); 
    }
    return res.redirect('back');

}