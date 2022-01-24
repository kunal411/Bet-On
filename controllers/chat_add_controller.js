const Contest = require('../models/contest');

module.exports.addChat = async function(req, res){
    const contestId = req.query.contestId;
    const message = req.query.message;
    const userId = req.query.userId;

    try{
        let contest = await Contest.findOne({_id : contestId});
        if(contest){
            const messageArray = contest.chatMessages;
            const newMessage = {
                userId : userId,
                message: message
            }

            messageArray.push(newMessage);
            await Contest.updateOne({_id : contestId}, {$set:{
                chatMessages: messageArray
            }})
        }
    }catch(err){
        console.log('Error : ', err);
    }
}