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
    const enterAmount = document.getElementById('enter-amount-div');
    if(walletDetails.style.display == "block"){
        walletDetails.style.display = "none";
    }
    else{
        enterAmount.style.display = "none";
        walletDetails.style.display = "block";
    }
})

const addMoney = document.getElementById('add-money-button');
const addCash = document.getElementById('add-cash-button');
const addMonetTextArea = document.getElementById('enter-amount-input');
addMoney.addEventListener('click', function(event){
    event.stopPropagation();
    const amount = Number(addMonetTextArea.value);
    if(!isNaN(amount) && amount >= 20){
        addCash.disabled = false;
    }
    else{
        addCash.disabled = true;
    }
    const enterAmount = document.getElementById('enter-amount-div');
    const walletDetails = document.getElementById('wallet-details');
    if(enterAmount.style.display == "block"){
        enterAmount.style.display = "none";
    }
    else{
        walletDetails.style.display = "none";
        enterAmount.style.display = "block";
    }
})

addMonetTextArea.onkeyup = function(){
    const amount = Number(addMonetTextArea.value);
    if(!isNaN(amount) && amount >= 20){
        addCash.disabled = false;
    }
    else{
        addCash.disabled = true;
    }

    axios.post(`/users/profile/details?amount=${Number(addMonetTextArea.value)}`).then((info) => {
        console.log(info);
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