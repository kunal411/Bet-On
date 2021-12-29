const createBtn = document.getElementById('create-team-button');
const createContestBtn = document.getElementById('create-contest-button');
const contestCards = document.querySelectorAll('#money-to-join-contest');
const backgrnd = document.getElementById('container');
const allContainers = document.querySelectorAll('.extra-contanier');
const myTeamBtn = document.getElementById('team-display-button');

// To close all the container on contest-card pages.
function closeContainers(){
    for(let i = 0; i < allContainers.length; i++){
        allContainers[i].style.display = "none";
    }
}

let contestId;
let matchId;
createBtn.addEventListener('click',function(){
    console.log('Create team button clicked');
    alert('Select the players according to the followings rule :\r\n1. Select 4-7 players from each team.\r\n2. Select 3-6 batsman\r\n3. Select 3-6 bowlers.\r\n4. Select 1-3 wicket-keeper(s).\r\n5. Select 1-3 all-rounder(s).')
    const div=document.getElementById('select-players-parent');
    closeContainers();
    backgrnd.style.opacity = "0.5";
    div.style.display="block";
});

createContestBtn.addEventListener('click',function(){
    console.log('Create contest button clicked');
    const div=document.getElementById('create-contest-parent');
    closeContainers();
    backgrnd.style.opacity = "0.5";
    div.style.display="block";
})

for(let i = 0; i < contestCards.length; i++){
    contestCards[i].addEventListener('click', function(event){
        console.log('Contest card clicked');
        event.stopPropagation();
        closeContainers();
        contestId = contestCards[i].getAttribute('data-contest-id');
        console.log(contestId);
        matchId = contestCards[i].getAttribute('data-match-id');
        const div=document.getElementById('join-contest');
        backgrnd.style.opacity = "0.5";
        div.style.display="block";
    })
}

const winningBreakup = document.querySelectorAll('.contest-prize-pool');
for(let i = 0;i < winningBreakup.length; i++){
    winningBreakup[i].addEventListener('click', function(event){
        event.stopPropagation();
        closeContainers();
        const count = winningBreakup[i].getAttribute('data-count');
        const winningBreakupContainer = document.querySelectorAll('.winnings-breakdown-container');
        backgrnd.style.opacity = "1";
        for(let i = 0; i < winningBreakupContainer.length; i++){
            winningBreakupContainer[i].style.display = "none";
        }
        winningBreakupContainer[count].style.display = "block";
    })
}

const closeBreakup = document.querySelectorAll('.close-breakup');
for(let i = 0; i < closeBreakup.length; i++){
    closeBreakup[i].addEventListener('click', function(){
        const winningBreakupContainer = document.querySelectorAll('.winnings-breakdown-container');
        backgrnd.style.opacity = "1";
        for(let i = 0; i < winningBreakupContainer.length; i++){
            winningBreakupContainer[i].style.display = "none";
        }
    })
}


const scorecard = document.getElementById('scoreCard');
const scorecardContainer = document.getElementById('scorecard-container');
scorecard.addEventListener('click', function(){
    closeContainers();
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

const addPlayer = document.querySelectorAll('.player-block');
var addedPlayers = [];
let wkCount = 0;
let batCount = 0;
let bowlCount = 0;
let allRCount = 0;
let team1 = 0;
let team2 = 0;

for(let i = 0; i < addPlayer.length; i++){
    let player = addPlayer[i];
    player.addEventListener('click', function(){
        const playerName = player.getAttribute('data-player-name');
        const playerId = player.getAttribute('data-player-id');
        const playerPosition = player.getAttribute('data-player-position');
        const team = player.getAttribute('data-team');

        let childLabelCaptain = player.children[2].children[0].children[0];
        let childLabelViceCaptain = player.children[3].children[0].children[0];

        const position = player.getAttribute('data-player-position');
        console.log(position);
        matchId = player.getAttribute('data-match-id');
        let playerObj = {
            playerName: playerName,
            playerId: playerId,
            position: position
        }
        console.log(playerObj);
        let obj = addedPlayers.find(x => x.playerName === playerObj.playerName);
        const isPresent = addedPlayers.indexOf(obj);
        console.log(isPresent);
        if(isPresent > -1){
            addedPlayers.splice(isPresent, 1);
            if(team == "0")team1--;
            else team2--;

            if(playerPosition == "batsman"){
                batCount--;
            }else if(playerPosition == "bowler"){
                bowlCount--;
            }else if(playerPosition == "wicketkeeper"){
                wkCount--;
            }else{
                allRCount--;
            }
            childLabelCaptain.disabled = true;
            childLabelViceCaptain.disabled = true;
            
            childLabelCaptain.checked = false;
            childLabelViceCaptain.checked = false;

            player.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }
        else{
            if(addedPlayers.length == 11){
                alert('Cannot Add more than 11 players');
                return;
            }
            if(team == "0")team1++;
            else team2++;
            if(team1 > 7 || team2 > 7){
                alert('Cannot add more than 7 players form one team.');
                if(team == "0")team1--;
                else team2--;
                return;
            }
            if(playerPosition == "batsman"){
                batCount++;
            }else if(playerPosition == "bowler"){
                bowlCount++;
            }else if(playerPosition == "wicketkeeper"){
                wkCount++;
            }else{
                allRCount++;
            }
            if(wkCount > 3){
                alert('Cannot Add more than 3 Wicket-Keepers');
                wkCount--;
                return;
            }else if(batCount > 6){
                alert('Cannot Add more than 6 Batsman');
                batCount--;
                return;
            }else if(bowlCount > 6){
                alert('Cannot Add more than 6 Bowlers');
                bowlCount--;
                return;
            }else if(allRCount > 3){
                alert('Cannot Add more than 3 All-Rounder');
                allRCount--;
                return;
            }else if(wkCount + batCount > 7){
                alert('Cannot Add more Wicket-Keeper / Batsman');
                if(playerPosition == "batsman"){
                    batCount--;
                }else if(playerPosition == "wicketkeeper"){
                    wkCount--;
                }
                return;
            }else if(allRCount + bowlCount > 7){
                alert('Cannot Add more All-Rounder / Bowler');
                if(playerPosition == "bowler"){
                    bowlCount--;
                }else{
                    allRCount--;
                }
                return;
            }
            childLabelCaptain.disabled = false;
            childLabelViceCaptain.disabled = false;
            addedPlayers.push(playerObj);
            player.style.backgroundColor = "#00b137";
        }
        console.log(addedPlayers);
    });
}

myTeamBtn.addEventListener('click', function(){
    closeContainers();
    const userteamContainer = document.getElementsByClassName('user-team')[0];
    const isTeamPresent = userteamContainer.getAttribute("data-team");
    if(isTeamPresent == "false"){
        alert('Create Team First!!');
        backgrnd.style.opacity = "1";
        return;
    }
    backgrnd.style.opacity = "0.5";
    userteamContainer.style.display = "block";
});

const closeTeam = document.getElementsByClassName('close-team')[0];
closeTeam.addEventListener('click', function(){
    const userteamContainer = document.getElementsByClassName('user-team')[0];
    userteamContainer.style.display = "none";
    backgrnd.style.opacity = "1";
})

const captainBtn = document.querySelectorAll('.radio-btn-captain-label');
for(let i = 0;i < captainBtn.length; i++){
    captainBtn[i].addEventListener('click',function(event){
        event.stopPropagation();
        let nextBtn = captainBtn[i].parentElement.nextElementSibling;
        if(nextBtn){
            nextBtn.children[0].children[0].checked = false;
        }else{
            let preBtn = captainBtn[i].parentElement.previousElementSibling;
            preBtn.children[0].children[0].checked = false;
        }
    })
}

const yesButton = document.getElementById('yes-contest-join-button');
yesButton.addEventListener('click', function(){
    window.location.href = `http://localhost:8000/match/contest/join?matchId=${matchId}&contestId=${contestId}`;
})

const saveButton = document.getElementById('select-player-save');
saveButton.addEventListener('click',function(){
    console.log('Save button clicked');
    if(wkCount < 1){
        alert('Select 1-3 wicketkeepr');
        return;
    }else if(batCount < 3){
        alert('Select 3-6 batsman');
        return;
    }else if(bowlCount < 3){
        alert('Select 3-6 bowler');
        return;
    }else if(allRCount < 1){
        alert('Select 1-3 all-rounder');
        return;
    }
    let captainRadio = document.querySelectorAll('input[name="captain-radio"]');
    let viceCaptainRadio = document.querySelectorAll('input[name="vice-captain-radio"]');
    let captainId;
    let viceCaptainId;
    for(let i = 0; i < captainRadio.length; i++){
        if(captainRadio[i].checked == true){
            captainId = captainRadio[i].getAttribute("value");
        }
    }
    
    for(let i = 0; i < viceCaptainRadio.length; i++){
        if(viceCaptainRadio[i].checked == true){
            viceCaptainId = viceCaptainRadio[i].getAttribute("value");
        }
    }

    if(!captainId || !viceCaptainId){
        alert('Plaease add captain and vice captain!!');
        return;
    }

    console.log("*************" + captainId + "*******//////////////" + viceCaptainId);

    if(addedPlayers.length==11){
        alert('Team saved successfully!!');
        const div=document.getElementById('select-players-parent');
        div.style.display="none";
        backgrnd.style.opacity = "1";
        let players = JSON.stringify(addedPlayers);
        window.location.href = `http://localhost:8000/match/contest/team?id=${matchId}&teamArray=${players}&captainId=${captainId}&viceCaptainId=${viceCaptainId}`;
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
        playersDivs[i].style.backgroundColor="rgba(255, 255, 255, 0.8)";
    }
    backgrnd.style.opacity = "1";
    const div=document.getElementById('select-players-parent');
    div.style.display="none";
    addedPlayers = [];
    wkCount = 0;
    batCount = 0;
    bowlCount = 0;
    allRCount = 0;
    team1 = 0;
    team2 = 0;
    let captainRadio = document.querySelectorAll('input[name="captain-radio"]');
    let viceCaptainRadio = document.querySelectorAll('input[name="vice-captain-radio"]');
    for(let i = 0; i < captainRadio.length; i++){
        captainRadio[i].checked = false;
        captainRadio[i].disabled = true;
    }
    
    for(let i = 0; i < viceCaptainRadio.length; i++){
        viceCaptainRadio[i].checked = false;
        viceCaptainRadio[i].disabled = true;
    }
});

const contestCard = document.querySelectorAll('.contest-card');
for(let i = 0; i < contestCard.length; i++){
    let contestId = contestCard[i].getAttribute('data-contest-id');
    let matchId = contestCard[i].getAttribute('data-match-id');
    contestCard[i].addEventListener('click', function(){
        console.log(contestId); 
        window.location.href = `http://localhost:8000/match/contest/leaderboard?matchId=${matchId}&contestId=${contestId}`;
    })
}


