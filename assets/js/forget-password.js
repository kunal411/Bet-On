const forgetPassword = document.getElementsByClassName('forget-password')[0];
forgetPassword.addEventListener('click',function(){
    window.location.href = `http://localhost:8000/users/forget-password`;
})