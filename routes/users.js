const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
const forgetPasswordController = require('../controllers/forget-password-controller');
const userProfileController = require('../controllers/user_profile_controller');
const razorpayController = require('../controllers/razorpay_create_controller');

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/step3', usersController.otp);
router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
'local',
{failureRedirect: '/users/sign-in'},
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);
router.get('/profile/:userId', passport.checkAuthentication, userProfileController.profile);
router.post('/profile/details', razorpayController.addCashInfo);
router.post('/profile/withdraw', razorpayController.withdrawCash);
router.post('/profile/addAccount', userProfileController.addAccount);
router.post('/profile/is-order-completed', razorpayController.checkTransaction);
router.post('/profile/follow', passport.checkAuthentication, userProfileController.followUpdate);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);
router.get('/forget-password',forgetPasswordController.forgetPassword);
router.post('/reset-password',forgetPasswordController.resetPassword);
router.post('/reset-password-db',forgetPasswordController.restPasswordIndb);
router.post('/otp-auth-forget-password', forgetPasswordController.otp);
    
module.exports = router;