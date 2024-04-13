const currentUrl = new URL(window.location.href);
const pathSegments = currentUrl.pathname.split('/');
const Productid=pathSegments[3]



function zoom(imgid){
    let img=document.querySelector(imgid)
    let zoomelement=document.querySelector('#zoom')
    zoomelement.style.backgroundImage=`url(${img.src})`
    zoomelement.style.backgroundSize=(img.width*3)+'px '+(img.height*3)+'px';
    img.addEventListener('mousemove',moveLens)
    img.addEventListener('mouseleave',(e)=>{
        e.stopPropagation()
        zoomelement.style.display='none'
    })
    zoomelement.addEventListener('mousemove',moveLens)
    function moveLens(e){
        e.stopPropagation()
        if(window.getComputedStyle(zoomelement).display=='none'){
            zoomelement.style.display='block'
        }
        zoomelement.style.backgroundImage=`url(${img.src})`
        zoomelement.style.backgroundSize=(img.width*3)+'px '+(img.height*3)+'px';
        let pos=getcursor()
        let posleft=pos.x-(zoomelement.offsetWidth/2)
        let postop=pos.y -(zoomelement.offsetHeight/2)
        zoomelement.style.left=posleft+'px'
        zoomelement.style.top=postop+'px'

        zoomelement.style.backgroundPosition='-'+(pos.x*3)+'px -'+(pos.y*3)+'px'
    }
    function getcursor(){
        let e=window.event
        let bounds=img.getBoundingClientRect()
        let x=e.pageX-bounds.left
        let y=e.pageY-bounds.top
        return{
            'x':x,
            'y':y
        }
    }
}
zoom('.imgzoomx')


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


async function addwishlist(a,id){
    let b=await fetch(`http://suggo.shop/user/wishlist/addwishlist/${a}/${id}`)
    b= await b.json()
    if(b?.added){
        if(b?.exists){
            appendAlert('Product already added wishlist','warning')
        }else{
            appendAlert('Product added to wishlist','success')
        }
    }else{
        appendAlert('Error in adding to wishlist','danger')
    }
}

async function addToCart(a,f){
    let c=document.getElementById('qty').value
    let b=await fetch(`http://suggo.shop/user/cart/addtocart/${a}/${f}/${c}`)
    b= await b.json()
    if(b?.added){
        if(b?.exists){
            appendAlert('Product already added Cart','warning')
        }else{
            appendAlert('Product added to Cart','success')
        }
    }else{
        appendAlert('Error in adding to Cart','danger')
    }
}


// function rateit(){
//     let button=document.querySelectorAll('.ratestar button')
//     button.forEach((a,i)=>{
//         a.addEventListener('click',async(e)=>{
//             e.stopPropagation()
//             await ratesend(i)
//         })
//     })
// }
// rateit()
// async function ratesend(i){
//     let a=await fetch(`/rate/${Productid}/${i}`)
//     a=await a.json()
    
// }






const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}






function imageselect(){
    let a=document.querySelectorAll('.imgsmall')
    let b=document.querySelector('.imgzoomx')
    a.forEach(element => {
        element.addEventListener('click',(e)=>{
            e.stopPropagation()
            let x=element.src
            let y=b.src
            element.src=y
            b.src=x
        })
    });
}
imageselect()


function addnumselect(){
    let a=document.getElementById('qty')
    for(i=1;i<=10;i++){
        let option=document.createElement('option')
        option.innerHTML=`${i}`
        option.value=i
        a.appendChild(option)
    }
}
addnumselect()