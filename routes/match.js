const express = require('express');
const router = express.Router();

const matchController=require('../controllers/match_controller');
const teamController = require('../controllers/team_controller');
const joinTeamController = require('../controllers/join-team-controller');
const leaderBoardController = require('../controllers/leaderboard-controller');
const createContestController = require('../controllers/create_contest_controller');
const joinContestController = require('../controllers/join-contest-controller');

router.get('/contest',matchController.contest);
router.get('/contest/team', teamController.createTeam);
router.get('/contest/join', joinTeamController.joinTeam);
router.get('/contest/leaderboard', leaderBoardController.leaderBoardUpdate);
router.get('/contest/create-contest', createContestController.createContest);
router.get('/contest/join-contest',joinContestController.joinContest);


module.exports = router;