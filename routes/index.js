const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');
const userController = require('../controllers/users_controller');
const forgetPasswordController = require('../controllers/forget-password-controller')

console.log('router loaded');


router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/match', require('./match'));

router.get('/authentication/activate',userController.activateAccount);
router.get('/authentication/reset',forgetPasswordController.resetAccount)
router.get('/contest')


module.exports = router;