const express = require('express');
const router = express.Router();

const matchController=require('../controllers/match_controller');

router.get('/contest',matchController.contest);

module.exports = router;