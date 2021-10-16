const User = require('../models/user');
const fs = require('fs');
const path = require('path');

const jwt = require('jsonwebtoken');
let alert = require('alert'); 
const activatekey = 'accountactivatekey123';
const clientURL = 'http://localhost:8000';

const mailGunKey ='b1787e2d85011b99456fadc88536a30c-2ac825a1-4a96be09';
const domain = 'sandboxa1a4db53718b4068b7ef30a64848a271.mailgun.org';

const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: mailGunKey , domain: domain});

// let's keep it same as before
// module.exports.profile = function(req, res){
//     User.findById(req.params.id, function(err, user){
//         return res.render('user_profile', {
//             title: 'User Profile',
//             profile_user: user
//         });
//     });

// }


// module.exports.update = async function(req, res){
//     if(req.user.id == req.params.id){
//         // User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
//         //     return res.redirect('back');
//         // });
//         try{
//             let user = await User.findById(req.params.id);
//             User.uploadedAvatar(req, res, function(err){
//                 if(err){
//                     console.log('****multer error : ', err);
//                 }
//                 else{
//                     user.name = req.body.name;
//                     user.email = req.body.email;
//                     if(req.file){

//                         if(user.avatar){
//                             if(fs.existsSync(path.join(__dirname, '..', user.avatar))){
//                                 fs.unlinkSync(path.join(__dirname, '..', user.avatar));
//                             }
//                         }
//                         //this is saving the path of the uploaded file into the avatar field in the user
//                         user.avatar = User.avatarPath + '/' + req.file.filename;
//                     }
//                     user.save();
//                     console.log(req.file);
//                 }
//                 return res.redirect('back');
//             });
//         }catch(err){
//             return res.redirect('back');
//         }
//     }else{
//         return res.status(401).send('Unauthorized');
//     }
// }


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "BETON-DOMINO | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "BETON-DOMINO | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req,res){

    const {name, email, password, confirmPassword} = req.body;
    console.log(name , email, password, confirmPassword);
    console.log(req.body);
    if( password != confirmPassword){
        alert("Password and Confirm Password should be same");
        return res.redirect('back');
    }
    
    User.findOne({email : email}, function(err , user){
        if(err){
            console.log('Error in finding user in Sign-in ');
            return res.redirect('back');
        }
        
        if(!user){ 

            const token = jwt.sign({name, email, password, confirmPassword},activatekey,{expiresIn : '20m'});

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
                    console.log(error.message);
                    return res.redirect('back');
                }
                console.log('Email has been sent for vecrification');
                return res.redirect('back');    
            });

            // User.create(req.body,function(err,user){
            //     if(err){
            //         console.log('Error in creating a user while sign-in');
            //         return res.redirect('back');
            //     }else{
            //         console.log("SignUp successfully!!");
            //         return res.redirect('back');
            //     }
            // });
        }else{
            console.log('User with this email already exist!!');
            return res.redirect('back');
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
                return res.redirect('back');
            }
            const{name , email , password, confirmPassword} = decodedToken;
            var user1 = new User();
            user1.name = name;
            user1.email = email;
            user1.password = password;
            user1.confirmPassword = confirmPassword;
            User.findOne({email : email}, function(err , user){
                if(err){
                    console.log('Error in finding user in Sign-in ');
                }
                
                if(!user){
                    User.create(user1,function(err,user){
                        if(err){
                            console.log('Error in creating a user while account activation', err);
                            return res.redirect('back');
                        }
                        return res.redirect('/');
                    });
                }else{
                    console.log("SignUp successfully!!");
                    return res.redirect('back');
                }
            });
        });
    }else{
        console.log('Something went wrong!!');
        return res.redirect('back');
    }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();


    return res.redirect('/');
}