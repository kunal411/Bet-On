const express = require('express');

const router = express.Router();
// const homeController = require('../controllers/home_controller');
const userController = require('../controllers/users_controller');

console.log('router loaded');


// router.get('/', homeController.home);
router.use('/users', require('./users'));
router.get('/authentication/activate',userController.activateAccount);


module.exports = router;