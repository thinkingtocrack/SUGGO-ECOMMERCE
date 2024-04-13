async function removecart(event,a,c){
    let parent=event.target.parentNode
    let grand=parent.parentNode
    let ggrand=grand.parentNode
    let b=await fetch(`http://localhost:4000/user/cart/removecart/${a}/${c}`)
    b=await b.json()
    if(b?.added){
        if(b?.exists){
            appendAlert('Product is not in your Cart','warning')
        }else{
            ggrand.style.transition='opacity 1s ease-out'
            ggrand.style.opacity='0'
            setTimeout(() => {
                ggrand.remove()
            }, 1000);
            appendAlert('Product removed from Cart','success')
        }
    }else{
        appendAlert('Error in removing from Cart','danger')
    }    
}


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



async function qtychange(event,id,vid){
    await addToCart(event,id,vid)
    totalcalculator()
}

function totalcalculator(){
    let price=document.querySelectorAll('.price')
    let qty=document.querySelectorAll('.qty')
    let total=0
    for(i=0;i<price.length;i++){
        newprice=Number(price[i].innerHTML.slice(4))
        total+=Number(qty[i].value)*newprice
    }
    document.querySelector('#totalprice').innerHTML=`₹${total}`
    if(price.length<1){
        document.querySelector('#delcharge').innerHTML=`0`
        document.querySelector('#totalcost').innerHTML=`₹${total}`
    }
    else if(total>=1000){
        document.querySelector('#delcharge').innerHTML=`Free`
        document.querySelector('#totalcost').innerHTML=`₹${total}`
    }else{
        document.querySelector('#delcharge').innerHTML=`₹100`
        document.querySelector('#totalcost').innerHTML=`₹${total+100}`
    }
}
totalcalculator()


async function addToCart(d,a,v){
    let c=d.target.value
    let b=await fetch(`http://localhost:4000/user/cart/addtocart/${a}/${v}/${c}`)
    b= await b.json()
    if(b?.added){
        if(b?.exists){
            appendAlert('product quantity not changed','warning')
        }else{
            appendAlert('Product quantity has ben changed','success')
        }
    }else{
        appendAlert('Error in chaning to Cart','danger')
    }
}