const forgetPassword = document.getElementsByClassName('forget-password')[0];
forgetPassword.addEventListener('click',function(){
    window.location.href = `/users/forget-password`;
})