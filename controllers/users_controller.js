const User = require('../models/user');
const fs = require('fs');
const path = require('path');
var request = require('request');

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
module.exports.create = async function(req,res){

    const {name, email, password, confirmPassword, phone, verify,referCode} = req.body;
    console.log(name , email, password, confirmPassword, phone, verify,referCode);
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
                const token = jwt.sign({name, email, password, confirmPassword, phone, referCode},activatekey,{expiresIn : '5m'});

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
                        var n, pa, ph, em, rc;
                        n = Buffer.from(name).toString('base64');
                        em = Buffer.from(email).toString('base64');
                        pa = Buffer.from(password).toString('base64');
                        ph = Buffer.from(phone).toString('base64');
                        rc = referCode
                        
                        console.log(resp);
                        return res.render('otp-auth', {
                            title: "Verify OTP",
                            name: n,
                            email: em,
                            password: pa,
                            phone: ph,
                            referCode: rc,
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

module.exports.otp = async function(req, res){
    var id = req.body.id;
    var token = req.body.token;
    var email = Buffer.from(req.body.email, 'base64').toString();
    var name = Buffer.from(req.body.name, 'base64').toString();
    var password = Buffer.from(req.body.password, 'base64').toString();
    var phone = Buffer.from(req.body.phone, 'base64').toString();
    var referCode = Buffer.from(req.body.referCode, 'base64').toString();
    console.log(email, name, password, phone, referCode);

    messageBird.verify.verify(id, token, async function(err, response){
        if(err){
            // var n, pa, ph, em, rc;
            // n = Buffer.from(name).toString('base64');
            // em = Buffer.from(email).toString('base64');
            // pa = Buffer.from(password).toString('base64');
            // ph = Buffer.from(phone).toString('base64');
            console.log(err);
            console.log("id is ", id);
            console.log("token is ", token);
            alert('OTP entered is incorrect, please signUp again');
            res.redirect('http://localhost:8000/users/sign-up')
        }
        else{
            var user1 = new User();
            let amount = 0;
            const userRefer = "";
            if(referCode != ""){
                userRefer = await User.findOne({_id:referCode});
            }

            if(userRefer){
                user1.wallet = 100;
                amount = userRefer.wallet;
            }

            const userId = email.split("@")[0];
            user1.userId = userId;
            user1.name = name;
            user1.email = email;
            user1.password = Buffer.from(password).toString('base64');
            user1.phone = phone;

            var options = {
                'method': 'POST',
                'url': 'https://api.razorpay.com/v1/contacts',
                'headers': {
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic cnpwX3Rlc3RfT0N0MTBGeGpuWFROV0s6RlpyNW9YQjFCWnFtbDBhUlRhd0IwSUh1'
                },
                body: JSON.stringify({
                  "name": user1.name,
                  "email": user1.email,
                  "contact": user1.phone,
                  "type": "employee",
                  "reference_id": "Domino Contact ID 12345",
                  "notes": {
                    "random_key_1": "Make it so.",
                    "random_key_2": "Tea. Earl Grey. Hot."
                  }
                })
              
            };

            let contact_id = "";
            let promise = new Promise((resolve,reject) =>{
                request(options, function (error, response) {
                    if (error) reject(error);
                    let s = JSON.parse(response.body);
                    console.log(s.id);
                    contact_id = s.id;
                    user1.contact_id = contact_id;
                    resolve();
                });
            });
            promise.then( async ()=>{
                User.findOne({email : email}, async function(err , user){
                    if(err){
                        alert('Something went wrong, please sign-up again');
                        console.log('Error in finding user in Sign-in ');
                        return res.redirect('/sign-up');
                    }
                    
                    if(!user){
                        User.create(user1,async function(err,user){
                            if(err){
                                console.log('Error in creating a user while account activation', err);
                                return res.redirect('back');
                            }
                            if(referCode != ""){
                                const userRefer = await User.updateOne({_id:referCode},{$set : {
                                    wallet : amount + 100
                                }})
                            }
                            console.log("SignUp successfully!!");
                            return res.redirect('http://localhost:8000/');
                        });
                    }else{
                        return res.redirect('/sign-in');
                    }
                });
            }).catch((err)=>{
                console.log("Error : " + err);
            })
        }
    });
}

module.exports.activateAccount = async function(req,res){
    const token = req.query.token;
    console.log(token);
    if(token){
        jwt.verify(token,activatekey, async function(err, decodedToken){
            if(err){
                console.log('Incorrect or expire link');
                return res.redirect('http://localhost:8000/users/sign-up');
            }
            const{name , email , password, confirmPassword, phone, referCode} = decodedToken;

            var user1 = new User();
            let amount=0;
            var userIdRefer = Buffer.from(referCode, 'base64').toString();
            const userRefer = "";
            if(userIdRefer != ""){
                userRefer = await User.findOne({_id:userIdRefer});
            }
            if(userRefer){
                user1.wallet = 100;
                amount = userRefer.wallet;
            }

            const userId = email.split("@")[0];
            user1.userId = userId;
            user1.name = name;
            user1.email = email;
            user1.password = Buffer.from(password).toString('base64');
            user1.phone = phone;


            var options = {
                'method': 'POST',
                'url': 'https://api.razorpay.com/v1/contacts',
                'headers': {
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic cnpwX3Rlc3RfT0N0MTBGeGpuWFROV0s6RlpyNW9YQjFCWnFtbDBhUlRhd0IwSUh1'
                },
                body: JSON.stringify({
                  "name": user1.name,
                  "email": user1.email,
                  "contact": user1.phone,
                  "type": "employee",
                  "reference_id": "Domino Contact ID 12345",
                  "notes": {
                    "random_key_1": "Make it so.",
                    "random_key_2": "Tea. Earl Grey. Hot."
                  }
                })
              
            };

            let contact_id = "";
            let promise = new Promise((resolve,reject) =>{
                request(options, function (error, response) {
                    if (error) reject(error);
                    let s = JSON.parse(response.body);
                    console.log(s.id);
                    contact_id = s.id;
                    user1.contact_id = contact_id;
                    resolve();
                });
            });

            promise.then( async ()=>{
                User.findOne({email : email}, function(err , user){
                    if(err){
                        console.log('Error in finding user in Sign-in ');
                        return res.redirect('http://localhost:8000/users/sign-up');
                    }
                    
                    if(!user){
                        User.create(user1, async function(err,user){
                            if(err){
                                console.log('Error in creating a user while account activation', err);
                                return res.redirect('back');
                            }
                            if(userIdRefer != ""){
                                const userRefer = await User.updateOne({_id:userIdRefer},{$set : {
                                    wallet : amount + 100
                                }})
                            }
                            return res.redirect('http://localhost:8000/users/sign-in');
                        });
                    }else{
                        // alert('Email id already exists')
                        return res.redirect('http://localhost:8000/users/sign-in');
                    }
                });
            }).catch((err)=>{
                console.log("Error : " + err);
            })
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