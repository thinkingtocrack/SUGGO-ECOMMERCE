async function removewishlist(event,a,v){
    let ggrand=event.target.parentNode.parentNode.parentNode
    let b=await fetch(`http://localhost:4000/user/wishlist/removewishlist/${a}/${v}`)
    b=await b.json()
    if(b?.added){
        if(b?.exists){
            appendAlert('Product is not in your Wishlist','warning')
        }else{
            ggrand.style.transition='opacity 1s ease-out'
            ggrand.style.opacity='0'
            setTimeout(() => {
                ggrand.remove()
            }, 1000);
            appendAlert('Product removed from Wishlist','success')
        }
    }else{
        appendAlert('Error in removing from Wishlist','danger')
    }    
}


async function addToCart(event,a,v){
    let c=1
    let b=await fetch(`http://localhost:4000/user/cart/addtocart/${a}/${v}/${c}`)
    b= await b.json()
    if(b?.added){
        if(b?.exists){
            appendAlert('Product already added Cart','warning')
            removewishlist(event,a,v)
        }else{
            appendAlert('Product added to Cart','success')
            removewishlist(event,a,v)
        }
    }else{
        appendAlert('Error in adding to Cart','danger')
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