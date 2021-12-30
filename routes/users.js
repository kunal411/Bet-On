const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
const forgetPasswordController = require('../controllers/forget-password-controller');

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

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);
router.get('/forget-password',forgetPasswordController.forgetPassword);
router.get('/reset-password-db',forgetPasswordController.restPasswordIndb);

module.exports = router;