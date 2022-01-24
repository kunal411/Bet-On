const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const request = require('request');

//tell passport to use a new startegy for google login
passport.use(new googleStrategy({
        clientID: "1079664389518-m4uaid1nv7rhhvm1cp6ins5o2nivag6g.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "https://domino-beton.herokuapp.com/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){
        //find a user
        User.findOne({email : profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('Error in google strategy passport', err);
                return;
            }
            if(user){
                //if found set this user as req.user
                console.log('User Already Exists');
                return done(null, user);
            }else{
                var options = {
                    'method': 'POST',
                    'url': 'https://api.razorpay.com/v1/contacts',
                    'headers': {
                      'Content-Type': 'application/json',
                      'Authorization': 'Basic cnpwX3Rlc3RfT0N0MTBGeGpuWFROV0s6RlpyNW9YQjFCWnFtbDBhUlRhd0IwSUh1'
                    },
                    body: JSON.stringify({
                      "name": profile.displayName,
                      "email": profile.emails[0].value,
                      "contact": "9123456789",
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
                        resolve();
                    });
                });
                promise.then( async ()=>{
                //if not found then create this user and set this user as req.user
                const userId = profile.emails[0].value.split("@")[0];
                    User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value, 
                        userId: userId,
                        password: crypto.randomBytes(20).toString('hex'),
                        contact_id: contact_id
                    }, function(err, user){
                        if(err){
                            console.log('Error in creating the user', err);
                            return;
                        }
                        return done(null, user);
                    });
                }).catch((err)=>{
                    console.log("Error : " + err);
                })
            }
        });
    }
));

module.exports = passport;