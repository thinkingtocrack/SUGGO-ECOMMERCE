function toggleEye(){
    const p=document.getElementById('inputPassword')
    p.type= (p.type==='text')?'password':'text'
}
function validateform(){
    const p = document.getElementById('inputPassword')
    const pe = document.getElementById('passworderror')
    pe.innerHTML=''
    pe.style.display='none'
    let validation=true
    validation = p.value.length>5?true:false
    if(!validation){
        pe.innerHTML='password should be min 6 charactor'
        pe.style.display='block'
    }
    return validation
}