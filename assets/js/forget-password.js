const forgetPassword = document.getElementsByClassName('forget-password')[0];
forgetPassword.addEventListener('click',function(){
    window.location.href = `https://domino-beton.herokuapp.com/users/forget-password`;
})