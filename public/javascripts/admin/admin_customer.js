function deleteProduct(a){
    const myModal = new bootstrap.Modal(document.getElementById('deleteModal'),{backdrop:'static'})
    myModal.show()
    document.getElementById('deleteCustomerBtn').addEventListener('click',(e)=>{
        e.stopPropagation();
        fetch(`https://suggo.shop/admin/customer/deleteuser/${a}`)
        .then((a)=>{
            return a.json()
        })
        .then((a)=>{
            if(a.deleteduser){
                location.reload()
            }else{
                alert('product not deleted')
            }
        })
    })
}


function productStatus(a,b){
    const statusModal=document.getElementById('statusModal')
    c=statusModal.getElementsByClassName('form-check-input')
    if(b){
        c[0].checked=true
    }else{
        c[1].checked=true
    }
    const myModal=new bootstrap.Modal(statusModal,{backdrop:'static'})
    myModal.show()
    document.getElementById('publishStatus').addEventListener('click',(e)=>{
        e.stopPropagation()
        if(c[0].checked==true){
            b=true
        }else{
            b=false
        }
        fetch('https://suggo.shop/admin/customer/status',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                customerid:a,
                status:b,
            })
        })
        .then(a=>a.json())
        .then((a)=>{
            if(a.done){
                location.reload()
            }else{
                alert('customer status not updated')
            }
        })
    })
}