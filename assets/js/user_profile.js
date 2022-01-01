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

const referCodeCopyBtn = document.getElementById('refer-code-copy');
referCodeCopyBtn.addEventListener('click', async function(event){
    event.stopPropagation();
    const referCode = referCodeCopyBtn.getAttribute('data-refer-code');
    try {
        await navigator.clipboard.writeText(referCode);
        console.log('Page URL copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
    alert("Copied the text: " + referCode);
})

const referAndEarn = document.getElementById('refer-div');
referAndEarn.addEventListener('click', function(){
    console.log('Refer and Earn button clicked');
    const referAndEarn = document.getElementById('referAndEarn');
    if(referAndEarn.style.display == "block"){
        referAndEarn.style.display = "none";
    }
    else{
        referAndEarn.style.display = "block";
    }
})

const wallet = document.getElementById('wallet-icon-name');
wallet.addEventListener('click', function(){
    console.log('Refer and Earn button clicked');
    const walletDetails = document.getElementById('wallet-details');
    if(walletDetails.style.display == "block"){
        walletDetails.style.display = "none";
    }
    else{
        walletDetails.style.display = "block";
    }
})