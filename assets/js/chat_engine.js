const chatMessageList = document.getElementById('chat-messages-list');
class ChatEngine{
    constructor(chatBoxId, userEmail, chatRoom){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.chatRoom = chatRoom;

        this.socket = io.connect('http://localhost:5100', { transports : ['websocket'] });

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: self.chatRoom
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            $('#chat-message-input').val('')

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: self.chatRoom
                });
            }
        });

        self.socket.on('receive_message', async function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
                newMessage.append($('<p>', {
                    'html': 'You'
                }));
            }else{
                newMessage.append($('<p>', {
                    'html': data.user_email
                }));
            }


            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            let height = chatMessageList.scrollHeight;
            chatMessageList.scrollBy(0, height);
            await axios.post(`/match/contest/leaderboard/addMessage?message=${data.message}&userId=${data.user_email}&contestId=${self.chatRoom}`);
        })
    }
}