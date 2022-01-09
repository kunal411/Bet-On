// const userDiv = document.querySelector('.user-standing');
// const userrank = userDiv.getAttribute('data-rank');
// const numberOfWinner = userDiv.getAttribute('data-totalWinner');

// const allGrid = document.querySelectorAll('.user-standing');
// if(userrank <= numberOfWinner){
//     for(let x of allGrid){
//         x.style.backgroundColor = "#00b137";
//     }
// }else{
//     for(let x of allGrid){
//         x.style.backgroundColor = "#d52e2e";
//     }
// }

const UserTeamRankingPoints = document.querySelectorAll('.other-user-standing');
for(let i = 0; i < UserTeamRankingPoints.length; i++){
    UserTeamRankingPoints[i].addEventListener('click', function(){
        const count = UserTeamRankingPoints[i].getAttribute('data-team-count');
        console.log(count);
        const userteamContainer = document.querySelectorAll('.user-team');
        for(let j = 0; j < userteamContainer.length; j++){
            userteamContainer[j].style.display = "none";
        }
        userteamContainer[count].style.display = "block";
    })
}

const closeTeam = document.querySelectorAll('.close-team');
for(let i = 0; i < closeTeam.length; i++){
    closeTeam[i].addEventListener('click', function(){
        const userteamContainer = document.querySelectorAll('.user-team');
        for(let j = 0; j < userteamContainer.length; j++){
            userteamContainer[j].style.display = "none";
        }
    })
}

const user = document.getElementById('userId');
user.addEventListener('click', function(event){
    event.stopPropagation();
})