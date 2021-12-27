const express = require('express');
const router = express.Router();

const matchController=require('../controllers/match_controller');
const teamController = require('../controllers/team_controller');
const joinTeamController = require('../controllers/join-team-controller');
const leaderBoardController = require('../controllers/leaderboard-controller');

router.get('/contest',matchController.contest);
router.get('/contest/team', teamController.createTeam);
router.get('/contest/join', joinTeamController.joinTeam);
router.get('/contest/leaderboard', leaderBoardController.leaderBoardUpdate);



module.exports = router;