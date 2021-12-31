const User = require('../models/user');
const fs = require('fs');
const path = require('path');

const jwt = require('jsonwebtoken');
let alert = require('alert'); 
const messageBird = require('messagebird')('W2tTRdqV8xxNjMYhIXSX3eEY6');
const activatekey = 'accountactivatekey123';
const clientURL = 'http://localhost:8000';

const mailGunKey = '5d5399a434023a5c229e7a1e1a80d493-cac494aa-586b59e2';
const domain = 'sandbox11a51a4bfd9245d587c2b8a6d188b1fd.mailgun.org';

const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: mailGunKey , domain: domain});


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('http://localhost:8000/');
    }
    return res.render('user_sign_up', {
        title: "BETON-DOMINO | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('http://localhost:8000/');
    }
    return res.render('user_sign_in', {
        title: "BETON-DOMINO | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req,res){

    const {name, email, password, confirmPassword, phone, verify} = req.body;
    console.log(name , email, password, confirmPassword, phone, verify);
    console.log(req.body);
    if( password != confirmPassword){
        alert("Password and Confirm Password should be same");
        return res.redirect('http://localhost:8000/users/sign-up');
    }
    
    User.findOne({email : email}, function(err , user){
        if(err){
            alert('Something went wrong, please sign-up again');
            console.log(err);
            return res.redirect('http://localhost:8000/users/sign-up');
        }

        if(!user){ 

            if(verify == 'EMAIL'){
                const token = jwt.sign({name, email, password, confirmPassword, phone},activatekey,{expiresIn : '5m'});

                const data = {
                    from: 'noreply@student.com',
                    to: req.body.email,
                    subject: 'Account Activation Key',
                    html : `
                        <h2>Please click  on below link to activate your account</h2>
                        <a href="${clientURL}/authentication/activate?token=${token}">CLICK HERE</a>
                    `
                };
                mg.messages().send(data, function (error, body) {
                    if(error){
                        alert('Something went wrong, please sign-up again');
                        console.log(error.message);
                        return res.redirect('http://localhost:8000/users/sign-up');
                    }
                    console.log('Email has been sent for verification');
                    alert('Email has been sent for verification, please veirfy');
                    return res.redirect('sign-in');    
                });
    
            }
            else{
                var number = phone;
                messageBird.verify.create(number, {
                    template: "Your Verification code is %token."
                }, function(err, resp){
                    if(err){
                        alert('Something went wrong, please sign-up again');
                        console.log(err);
                        return res.redirect('http://localhost:8000/users/sign-up');
                    }
                    else{
                        var n, pa, ph, em;
                        n = Buffer.from(name).toString('base64');
                        em = Buffer.from(email).toString('base64');
                        pa = Buffer.from(password).toString('base64');
                        ph = Buffer.from(phone).toString('base64');
                        console.log(resp);
                        return res.render('otp-auth', {
                            title: "Verify OTP",
                            name: n,
                            email: em,
                            password: pa,
                            phone: ph,
                            id: resp.id
                        });
                    }
                });
            }
        }
        else{
            alert('Email id already exists');
            console.log('User with this email already exist!!');
            return res.redirect('sign-in');
        }
    });
}

module.exports.otp = function(req, res){
    var id = req.body.id;
    var token = req.body.token;
    var email = Buffer.from(req.body.email, 'base64').toString();
    var name = Buffer.from(req.body.name, 'base64').toString();
    var password = Buffer.from(req.body.password, 'base64').toString();
    var phone = Buffer.from(req.body.phone, 'base64').toString();
    console.log(email, name, password, phone);

    messageBird.verify.verify(id, token, function(err, response){
        if(err){
            var n, pa, ph, em;
            n = Buffer.from(name).toString('base64');
            em = Buffer.from(email).toString('base64');
            pa = Buffer.from(password).toString('base64');
            ph = Buffer.from(phone).toString('base64');
            console.log(err);
            console.log("id is ", id);
            console.log("token is ", token);
            alert('OTP entered is incorrect, please signUp again');
            res.redirect('http://localhost:8000/users/sign-up')
        }
        else{
            var user1 = new User();
            const userId = email.split("@")[0];
            user1.userId = userId;
            user1.name = name;
            user1.email = email;
            user1.password = Buffer.from(password).toString('base64');
            user1.phone = phone;
            User.findOne({email : email}, function(err , user){
                if(err){
                    alert('Something went wrong, please sign-up again');
                    console.log('Error in finding user in Sign-in ');
                    return res.redirect('/sign-up');
                }
                
                if(!user){
                    User.create(user1,function(err,user){
                        if(err){
                            console.log('Error in creating a user while account activation', err);
                            return res.redirect('back');
                        }
                        console.log("SignUp successfully!!");
                        return res.redirect('http://localhost:8000/');
                    });
                }else{
                    return res.redirect('/sign-in');
                }
            });
        }
    });
}

module.exports.activateAccount = function(req,res){
    const token = req.query.token;
    console.log(token);
    if(token){
        jwt.verify(token,activatekey, function(err, decodedToken){
            if(err){
                console.log('Incorrect or expire link');
                return res.redirect('http://localhost:8000/users/sign-up');
            }
            const{name , email , password, confirmPassword, phone} = decodedToken;
            var user1 = new User();
            const userId = email.split("@")[0];
            user1.userId = userId;
            user1.name = name;
            user1.email = email;
            user1.password = Buffer.from(password).toString('base64');
            user1.phone = phone;
            User.findOne({email : email}, function(err , user){
                if(err){
                    console.log('Error in finding user in Sign-in ');
                    return res.redirect('http://localhost:8000/users/sign-up');
                }
                
                if(!user){
                    User.create(user1,function(err,user){
                        if(err){
                            console.log('Error in creating a user while account activation', err);
                            return res.redirect('back');
                        }
                        return res.redirect('http://localhost:8000/users/sign-in');
                    });
                }else{
                    // alert('Email id already exists')
                    return res.redirect('http://localhost:8000/users/sign-in');
                }
            });
        });
    }else{
        alert('Something went wrong, please sign-up again');
        console.log('Something went wrong!!');
        return res.redirect('http://localhost:8000/users/sign-in');
    }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('http://localhost:8000/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('sign-in');
}