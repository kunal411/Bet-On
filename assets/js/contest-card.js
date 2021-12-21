const createBtn=document.getElementById('create-team-button');
createBtn.addEventListener('click',function(){
    console.log('Create team button clicked');
    const div=document.getElementById('select-players-parent');
    const backgrnd=document.getElementById('container');
    backgrnd.style.opacity = "0.5";
    div.style.display="block";
});

const addPlayer = document.querySelectorAll('.player-add-icon');
var addedPlayers = [];
let matchId;
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
        const isPresent = addedPlayers.indexOf(playerObj);
        // console.log(isPresent);
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

const saveButton = document.getElementById('select-player-save');
saveButton.addEventListener('click',function(){
    console.log('Save button clicked');
    if(addedPlayers.length==11){
        alert('Taam saved successfully!!');
        const div=document.getElementById('select-players-parent');
        div.style.display="none";
        const backgrnd=document.getElementById('container');
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
    const backgrnd=document.getElementById('container');
    backgrnd.style.opacity = "1";
    const div=document.getElementById('select-players-parent');
    div.style.display="none";
    addedPlayers = [];
});
