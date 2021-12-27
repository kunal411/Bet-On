const userDiv = document.querySelector('.user-standing');
const userrank = userDiv.getAttribute('data-rank');
const numberOfWinner = userDiv.getAttribute('data-totalWinner');

const allGrid = document.querySelectorAll('.user-standing');
if(userrank <= numberOfWinner){
    for(let x of allGrid){
        x.style.backgroundColor = "#00b137";
    }
}else{
    for(let x of allGrid){
        x.style.backgroundColor = "#d52e2e";
    }
}