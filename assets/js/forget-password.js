const forgetPassword = document.getElementsByClassName('forget-password')[0];
forgetPassword.addEventListener('click',function(){
    window.location.href = `http://3.110.212.123:8000/users/forget-password`;
})