const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');
const userController = require('../controllers/users_controller');

console.log('router loaded');


router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/match', require('./match'));

router.get('/authentication/activate',userController.activateAccount);
router.get('/contest')


module.exports = router;