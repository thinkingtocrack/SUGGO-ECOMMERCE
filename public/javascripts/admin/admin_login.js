function toggleEye(){   
    const p=document.getElementById('password')
    p.type= (p.type==='password')?'text':'password'
}

let passhint

function validation(){
    clearTimeout(passhint)
    const a=document.querySelector('#email').value
    const b=document.querySelector('#password').value
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    let err=0
    if(!passwordRegex.test(b)){
        document.querySelector('#passhint').style.color='red'
        document.querySelector('#passhint').style.fontSize='large'
        passhint=setTimeout(() => {
            document.querySelector('#passhint').style.color='gray'
            document.querySelector('#passhint').style.fontSize='medium'
        }, 1000);
        return false
    }
    return true
}
let input=document.querySelectorAll('input')
let login_err=document.querySelector('#err')
function hide(a){
    a.style.opacity=0
    setTimeout(() => {
        a.style.display='none'
    }, 1000);
}
input[0].addEventListener('click',(e)=>{
    e.stopPropagation()
    hide(login_err)
})
input[1].addEventListener('click',(e)=>{
    e.stopPropagation()
    hide(login_err)
})