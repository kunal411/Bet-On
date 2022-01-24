// Imported all required Schema.
const User = require('../models/user');
const portURL = "https://domino-beton.herokuapp.com";
const jwt = require('jsonwebtoken');
// Importing meassagebird for sending email.
const messageBird = require('messagebird')('W2tTRdqV8xxNjMYhIXSX3eEY6');
const activatekey = 'accountactivatekey123';

// Messagebird domain and api_key
const mailGunKey = '5d5399a434023a5c229e7a1e1a80d493-cac494aa-586b59e2';
const domain = 'sandbox11a51a4bfd9245d587c2b8a6d188b1fd.mailgun.org';

const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: mailGunKey , domain: domain});

// Function to render forget password
module.exports.forgetPassword = function(req,res){
    return res.render('forget_password', {
        title: 'domino-beton || Forget Password'    
    });
}

// Function to reset the password
module.exports.resetPassword = async function(req,res){
    // User information from form
    const email = req.body.email;
    const phone = req.body.phone;
    const verify = req.body.verify;

    let ph, em;
    let tokenId = false;
    const user = await User.findOne({email:email,phone:phone});
    if(user){
        // verifying using email
        if(verify == 'EMAIL'){
            const token = jwt.sign({email, phone},activatekey,{expiresIn : '2m'});
            // sending reset link to user email
            const data = {
                from: 'noreply@student.com',
                to: req.body.email,
                subject: 'Account Reset Key',
                html : `
                    <h2>Please click  on below link to reset your account</h2>
                    <a href="${portURL}/authentication/reset?token=${token}">CLICK HERE</a>
                `
            };
            await mg.messages().send(data,function (error, body) {
                if(error){
                    req.flash('success','Something went wrong, please sign-up again');
                    console.log(error.message);
                    return res.redirect('back');
                }
                console.log('Email has been sent for verification for forget password');
                req.flash('success','Email has been sent for verification, please veirfy');
            });

        }else{
            // verifying using phone number
            var number = phone;
            await messageBird.verify.create(number, {
                template: "Your Verification code is %token."
            }, function(err, resp){
                if(err){
                    req.flash('success','Something went wrong, please sign-up again');
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
        req.flash('success','User not found!!');
        return res.redirect('back');
    }
}

// Function to verify the otp entered by user by token
module.exports.otp = function(req, res){
    // user detail
    var id = req.body.id;
    var token = req.body.token; // token of otp.
    var email = Buffer.from(req.body.email, 'base64').toString();
    var phone = Buffer.from(req.body.phone, 'base64').toString();
    console.log(email, phone);

    messageBird.verify.verify(id, token, function(err, response){
        if(err){
            req.flash('error','OTP entered is incorrect');
            res.redirect(`${portURL}/users/sign-up`)
        }
        else{
            // Rendering reset_password view after successful verification
            return res.render('reset_password', {
                title: 'domino-beton || Reset Password',
                email : email,
                phone : phone
            });
        }
    });
}

// Fuction to verify user form email link
module.exports.resetAccount = function(req,res){
    const token = req.query.token;
    console.log(token);
    if(token){
        jwt.verify(token,activatekey, function(err, decodedToken){
            if(err){
                // Expired or incorrect link
                console.log('Incorrect or expire link');
                return res.redirect(`${portURL}/users/sign-in`);
            }
            const{email, phone} = decodedToken;
            // Rendering reset_password view after successful verification
            return res.render('reset_password', {
                title: 'domino-beton || Reset Password',
                email : email,
                phone : phone
            });
        });
    }else{
        // redirecting to sign page
        req.flash('error','Something went wrong, please try again');
        console.log('Something went wrong!!');
        return res.redirect(`${portURL}/users/sign-in`);
    }
}

// Function to update the password in user document
module.exports.restPasswordIndb = async function(req,res){
    // user details
    const email = req.body.email;   
    // new password created by user
    let password = req.body.password;   
    const confirmPassword = req.body.confirmPassword;

    if(confirmPassword != password){
        req.flash('error','Password and confrim-password should be same!');
        return res.redirect('back');
    }
    try{
        // 
        password = Buffer.from(password).toString('base64');
        const user = await User.updateOne({email : email},{$set : {
            password : password
        }});
        req.flash('success','Password reset successfully!!');
        return res.redirect(`${portURL}/users/sign-in`);
    }catch(err){
        console.log("Error : " + err); 
    }
    return res.redirect('back');

}