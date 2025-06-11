let password = document.getElementById('password');
let message = document.getElementById('message');
let strength = document.getElementById('strength');

//logic for password strength 
password.addEventListener('input',()=>{
    if(password.value.length > 0){
        message.style.display ="block";
    }else{
        message.style.display ='none';
    }
    if(password.value.length < 4 && password.value.length !=0 ){
        strength.innerHTML = 'weak';
        password.style.borderColor = "#ff5925";
        message.style.color = "#ff5925";
    }else if (password.value.length >= 4 && password.value.length < 8 ){
        strength.innerHTML = 'medium';
        password.style.borderColor = "orange";
        message.style.color = "orange";
    }else if(password.value.length >= 8){
        strength.innerHTML = 'strong';
        password.style.borderColor = "#26d730";
        message.style.color = "#26d730";
    }
});


let eye = document.getElementById('peek-password');

//logic for peeking the password
eye.addEventListener('click', ()=>{
    if(password.type === 'password'){
        password.type = 'text';
        eye.src = "/PROJECT SOFTWARE DESIGN/Front-Page/images/eye-open.png"
    }else{
        password.type = 'password';
        eye.src = "/PROJECT SOFTWARE DESIGN/Front-Page/images/eye-background.png"
    }
})

let confirm_password = document.getElementById('confirm-password');
let message_confirm = document.getElementById('message-confirm');


//logic for confirm password
confirm_password.addEventListener('input', ()=>{
    if(password.value === confirm_password.value){
        message_confirm.innerHTML= 'Password match'
        message_confirm.style.color = '#26d730';
    }else{
        message_confirm.innerHTML= 'Password does not match'
        message_confirm.style.color = '#ff5925';
    }
})
