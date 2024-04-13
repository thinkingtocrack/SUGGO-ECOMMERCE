function filter(){
    let filtercheck=document.querySelectorAll('.filtercat')
    let input=document.querySelector('#hiddeninputx')
    let b=[]
    filtercheck.forEach((a)=>{
        if(a.checked){
            b.push(a.name)
        }
    })
    input.value=b
    filtercheck=document.querySelectorAll('.filtercolor')
    input=document.querySelector('#hiddeninputcolor')
    b=[]
    filtercheck.forEach((a)=>{
        if(a.checked){
            b.push(a.name)
        }
    })
    input.value=b
    return true
}

function priceEvent(){
    let pricefilter=document.querySelectorAll('.pricerange')
    pricefilter.forEach(a=>{
        a.addEventListener('input',selectedprice)
    })
}
priceEvent()
function selectedprice(event){
    event.stopPropagation()
    if(event.target.id=='minprice'){
        document.getElementById('maxprice').setAttribute('min',Number(event.target.value)+1)
    }
    event.target.labels[0].innerText=`${event.target.labels[0].innerText.slice(0,13)}${event.target.value}`
}

