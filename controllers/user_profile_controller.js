const User = require('../models/user');

module.exports.profile = async function(req, res){
    const userId = req.user.userId;
    let user;
    try{
        user = await User.findOne({userId: userId});
    }catch(err){
        console.log('Error : ' + err);
    }


    return res.render('user_profile',{
        title: 'My profile',
        userId: userId,
        userIdDB: user._id,
        numberOfContestJoined: user.numberOfContestJoined,
        totalAmountWon: user.totalAmountWon,
        numberOfContestWon: user.numberOfContestWon,
        numberOfTeamsCreated: user.numberOfTeamsCreated,
        wallet: user.wallet
    });
}