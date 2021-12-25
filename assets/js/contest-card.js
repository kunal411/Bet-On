const createBtn = document.getElementById('create-team-button');
const createContestBtn = document.getElementById('create-contest-button');
const contestCards = document.querySelectorAll('#money-to-join-contest');
const backgrnd=document.getElementById('container');
let contestId;
let matchId;
createBtn.addEventListener('click',function(){
    console.log('Create team button clicked');
    const div=document.getElementById('select-players-parent');
    backgrnd.style.opacity = "0.5";
    div.style.display="block";
});

createContestBtn.addEventListener('click',function(){
    console.log('Create contest button clicked');
    const div=document.getElementById('create-contest-parent');
    backgrnd.style.opacity = "0.5";
    div.style.display="block";
})

for(let i = 0; i < contestCards.length; i++){
    contestCards[i].addEventListener('click', function(){
        console.log('Contest card clicked');
        contestId = contestCards[i].getAttribute('data-contest-id');
        console.log(contestId);
        matchId = contestCards[i].getAttribute('data-match-id');
        const div=document.getElementById('join-contest');
        backgrnd.style.opacity = "0.5";
        div.style.display="block";
    })
}

const scorecard = document.getElementById('scoreCard');
const scorecardContainer = document.getElementById('scorecard-container');
scorecard.addEventListener('click', function(){
    backgrnd.style.opacity = "0.5";
    scorecardContainer.style.display="block";
})

const closeScorecard = document.getElementById('close-scorecard');
closeScorecard.addEventListener('click', function(){
    backgrnd.style.opacity = '1';
    scorecardContainer.style.display="none";
})

const noButton = document.getElementById('no-contest-join-button');
noButton.addEventListener('click', function(){
    backgrnd.style.opacity = "1";
    const div=document.getElementById('join-contest');
    div.style.display="none";
})

const addPlayer = document.querySelectorAll('.player-add-icon');
var addedPlayers = [];
for(let i = 0; i < addPlayer.length; i++){
    let player = addPlayer[i];
    player.addEventListener('click', function(){
        const playerName = player.getAttribute('data-player-name');
        const playerId = player.getAttribute('data-player-id');
        matchId = player.getAttribute('data-match-id');
        let playerObj = {
            playerName: playerName,
            playerId: playerId
        }
        console.log(playerObj);
        let obj = addedPlayers.find(x => x.playerName === playerObj.playerName);
        const isPresent = addedPlayers.indexOf(obj);
        console.log(isPresent);
        if(isPresent > -1){
            addedPlayers.splice(isPresent, 1);
            player.parentElement.parentElement.style.backgroundColor = "black";
        }
        else{
            if(addedPlayers.length == 11){
                alert('Cannot Add more than 11 players');
                return;
            }
            addedPlayers.push(playerObj);
            player.parentElement.parentElement.style.backgroundColor = "#00b137";
        }
        console.log(addedPlayers);
    });
}

const yesButton = document.getElementById('yes-contest-join-button');
yesButton.addEventListener('click', function(){
    window.location.href = `http://localhost:8000/match/contest/join?matchId=${matchId}&contestId=${contestId}`;
})

const saveButton = document.getElementById('select-player-save');
saveButton.addEventListener('click',function(){
    console.log('Save button clicked');
    if(addedPlayers.length==11){
        alert('Team saved successfully!!');
        const div=document.getElementById('select-players-parent');
        div.style.display="none";
        backgrnd.style.opacity = "1";
        let players = JSON.stringify(addedPlayers);
        window.location.href = `http://localhost:8000/match/contest/team?id=${matchId}&teamArray=${players}`;
    }else{
        alert('Please select 11 players to create a team!!');
        return;
    }
});

const cancelButton = document.getElementById('select-player-cancel');
cancelButton.addEventListener('click',function(){
    console.log('Cancel button clicked');
    const playersDivs = document.getElementsByClassName('player-block');
    for(let i=0;i<playersDivs.length;i++){
        playersDivs[i].style.backgroundColor="black";
    }
    backgrnd.style.opacity = "1";
    const div=document.getElementById('select-players-parent');
    div.style.display="none";
    addedPlayers = [];
});
