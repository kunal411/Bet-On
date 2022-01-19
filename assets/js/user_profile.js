const stats = document.getElementById('stat-icon-name');
if(stats){
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
}

const followButton = document.getElementById('follow-button');
if(followButton){
    followButton.addEventListener('click', async function(){
        const followUserId = followButton.getAttribute('data-follow-userId');
        await axios.post(`/users/profile/follow?followUserId=${followUserId}`);
        followButton.disabled = true;
        location.reload();
    })
}

const referCodeCopyBtn = document.getElementById('refer-code-copy');
if(referCodeCopyBtn){
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
}

const referAndEarn = document.getElementById('refer-div');
if(referAndEarn){
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
}

const transactionDiv = document.getElementById('transaction-div');
if(transactionDiv){
    transactionDiv.addEventListener('click', function(){
        console.log('transaction div clicked');
        const transactionDet = document.getElementById('transaction-details-container');
        if(transactionDet.style.display == "block"){
            transactionDet.style.display = "none";
        }
        else{
            transactionDet.style.display = "block";
        }
    })
}

const wallet = document.getElementById('wallet-icon-name');
if(wallet){
    wallet.addEventListener('click', function(){
        console.log('Refer and Earn button clicked');
        const walletDetails = document.getElementById('wallet-details');
        const enterAddAmount = document.getElementById('enter-add-amount-div');
        const enterwihdrawAmount = document.getElementById('enter-withdraw-amount-div');
        if(walletDetails.style.display == "block"){
            walletDetails.style.display = "none";
        }
        else{
            enterAddAmount.style.display = "none";
            enterwihdrawAmount.style.display = "none";
            walletDetails.style.display = "block";
        }
    })
}

const addMoney = document.getElementById('add-money-button');
const addCash = document.getElementById('add-cash-button');
const addMonetTextArea = document.getElementById('enter-add-amount-input');
if(addMoney){
    addMoney.addEventListener('click', function(event){
        event.stopPropagation();
        const amount = Number(addMonetTextArea.value);
        if(!isNaN(amount) && amount >= 20){
            addCash.disabled = false;
        }
        else{
            addCash.disabled = true;
        }
        const enterAmount = document.getElementById('enter-add-amount-div');
        const walletDetails = document.getElementById('wallet-details');
        if(enterAmount.style.display == "block"){
            enterAmount.style.display = "none";
        }
        else{
            walletDetails.style.display = "none";
            enterAmount.style.display = "block";
        }
    })
}

const withdrawMoney = document.getElementById('withdraw-money-button');
const withdrawCash = document.getElementById('withdraw-cash-button');
const withdrawMonetTextArea = document.getElementById('enter-withdraw-amount-input');
const walletdiv = document.getElementById('wallet-balance');
if(withdrawMoney){
    withdrawMoney.addEventListener('click', function(event){
        event.stopPropagation();
        const amount = Number(withdrawMonetTextArea.value);
        const walletBalance = Number(walletdiv.getAttribute('data-wallet-balance'));
        if((!isNaN(amount) && amount >= 100) && (amount <= walletBalance)){
            withdrawCash.disabled = false;
        }
        else{
            withdrawCash.disabled = true;
        }
        const enterAmount = document.getElementById('enter-withdraw-amount-div');
        const walletDetails = document.getElementById('wallet-details');
        if(enterAmount.style.display == "block"){
            enterAmount.style.display = "none";
        }
        else{
            walletDetails.style.display = "none";
            enterAmount.style.display = "block";
        }
    })
}

if(addMonetTextArea){
    addMonetTextArea.onkeyup = function(){
        const amount = Number(addMonetTextArea.value);
        if(!isNaN(amount) && amount >= 20){
            addCash.disabled = false;
        }
        else{
            addCash.disabled = true;
        }
    
        axios.post(`/users/profile/details?amount=${Number(addMonetTextArea.value)}`).then((info) => {
            var options = {
                "key": "rzp_test_OCt10FxjnXTNWK",
                "name": "Domino Beton",
                "description": "Test Transaction",
                "image": "https://www.iconbunny.com/icons/media/catalog/product/3/4/341.10-cricket-helmet-icon-iconbunny.jpg",
                "order_id": info.data.id,
                "callback_url": "/users/profile/is-order-completed",
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
    
            if(info.data.amount >= 2000){
                var rzp1 = new Razorpay(options);
                addCash.onclick = function(e){
                    rzp1.open();
                    e.preventDefault();
                }
            }
        })
    }
}

if(withdrawMonetTextArea){
    withdrawMonetTextArea.onkeyup = function(){
        const amount = Number(withdrawMonetTextArea.value);
        const walletBalance = Number(walletdiv.getAttribute('data-wallet-balance'));
        if((!isNaN(amount) && amount >= 100) && (amount <= walletBalance)){
            withdrawCash.disabled = false;
        }
        else{
            withdrawCash.disabled = true;
        }
    }
}

const withdrawCashButton = document.getElementById('withdraw-cash-button');
if(withdrawCashButton){
    withdrawCashButton.addEventListener('click', async function(){
        withdrawCashButton.disabled = true;
        await axios.post(`/users/profile/withdraw?amount=${Number(withdrawMonetTextArea.value)}`);
        location.reload();
        withdrawCashButton.disabled = true;
    })
}


const bankAccountDiv = document.getElementById('bank-account-div');
if(bankAccountDiv){
    bankAccountDiv.addEventListener('click', function(){
        const enterAccountDiv = document.getElementById('enter-account-div');
        if(enterAccountDiv.style.display == "block"){
            enterAccountDiv.style.display = "none";
        }
        else{
            enterAccountDiv.style.display = "block";
        }
    })
}

const followers = document.getElementsByClassName('followers')[0];
const following = document.getElementsByClassName('following')[0];
const followingListDiv = document.getElementById('following-list');
const followersListDiv = document.getElementById('followers-list');
const container = document.getElementsByClassName('container')[0];
if(followers){
    const followersLength = followersListDiv.getAttribute('data-followers-length');
    console.log(followersLength);
    followers.addEventListener('click', function(){
        if(followersLength == 0){
            followersListDiv.style.display = "none";
        }else{
            followingListDiv.style.display = "none";
            followersListDiv.style.display = "block";
            container.style.opacity = "0.4"
        }
    })
}

if(following){
    const followingLength = followingListDiv.getAttribute('data-following-length')
    console.log(followingLength);
    following.addEventListener('click', function(){
        if(followingLength == 0){
            followingListDiv.style.display = "none";
        }else{
            followingListDiv.style.display = "block";
            followersListDiv.style.display = "none";
            container.style.opacity = "0.4"
        }
    })
}

const closeFollowingList = document.getElementById('close-following-list');
const closeFollowersList = document.getElementById('close-followers-list');
if(closeFollowersList){
    closeFollowersList.addEventListener('click', function(){
        followingListDiv.style.display = "none";
        followersListDiv.style.display = "none";
        container.style.opacity = "1"
    })
}

if(closeFollowingList){
    closeFollowingList.addEventListener('click', function(){
        followingListDiv.style.display = "none";
        followersListDiv.style.display = "none";
        container.style.opacity = "1"
    })
}

const action = document.getElementsByClassName('action');
for(let i = 0; i < action.length; i++){
    console.log(action[i].textContent);
    if(action[i].textContent.trim() == "CASH WITHDRAW" || action[i].textContent.trim() == "JOINED CONTEST"){
        console.log('color shoud get changed');
        action[i].style.color = "red";
    }
}
