const stats = document.getElementById('stat-icon-name');
stats.addEventListener('click', function(){
    console.log('stats button clicked');
    const contestDetails = document.getElementById('contest-details');
    if(contestDetails.style.display == "block"){
        contestDetails.style.display = "none";
    }
    else{
        contestDetails.style.display = "block";
    }
})