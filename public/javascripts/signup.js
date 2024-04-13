let p = document.getElementById('password')
let cp = document.getElementById('cpassword')
let cpl=document.getElementsByClassName('checkerror')
let snum=document.getElementById('signupnumber')

function resetError(){
    cpl[0].style.display = 'none'
    cpl[1].style.display = 'none'
    snum.style.borderColor = 'black'
    p.style.borderColor = 'black'
    cp.style.borderColor = 'black'
}

function check(){
    resetError();
    let ans=true
    cpl[1].innerHTML=''
    if (isNaN(snum.value) || snum.value.length<10) {
        snum.style.borderColor = 'red'
        cpl[0].style.display='block'
        cpl[0].innerHTML='Please enter correct phone number'
        ans=false
    }
    if(p.value!=cp.value){
        cpl[1].style.display='block'
        cpl[1].innerHTML ='password do not match'
        p.style.borderColor='red'
        cp.style.borderColor='red'
        ans=false
    }
    if(p.value.length<6){
        cpl[1].style.display='block'
        cpl[1].innerHTML+=', password should be min 6 letters'
        ans=false
    }
    return ans
}
p.addEventListener('click',(event)=>{
    event.stopPropagation()
    if (window.getComputedStyle(p).borderColor === 'rgb(255, 0, 0)'){
        cpl[1].style.display = 'none'
        p.style.borderColor = 'black'
        cp.style.borderColor = 'black'
    }
})
cp.addEventListener('click', (event) => {
    event.stopPropagation()
    if (window.getComputedStyle(cp).borderColor === 'rgb(255, 0, 0)') {
        cpl[1].style.display = 'none'
        p.style.borderColor = 'black'
        cp.style.borderColor = 'black'
    }
})
snum.addEventListener('click', (event) => {
    event.stopPropagation()
    if (window.getComputedStyle(snum).borderColor === 'rgb(255, 0, 0)') {
        snum.style.borderColor = 'black'
        cpl[0].style.display='none'
    }
})

function toggleEye(a){
    const b=document.getElementById(a)
    if(b.type=='text'){
        b.type='password'
    }else{
        b.type='text'
    }
}

