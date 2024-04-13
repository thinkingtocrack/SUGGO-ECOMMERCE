function deleteCategory(a){
    const myModal = new bootstrap.Modal(document.getElementById('deleteModal'),{backdrop:'static'})
    myModal.show()
    document.getElementById('deleteCategoryBtn').addEventListener('click',(e)=>{
        e.stopPropagation();
        fetch(`https://suggo.shop/admin/category/deletecategory/${a}`)
        .then((a)=>{
            return a.json()
        })
        .then((a)=>{
            if(a.deleted){
                location.reload()
            }else{
                alert('product not deleted')
            }
        })
    })
}


function categoryStatus(a,b){
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
        fetch('https://suggo.shop/admin/category/status',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                statusid:a,
                status:b,
            })
        })
        .then(a=>a.json())
        .then((a)=>{
            if(a.done){
                location.reload()
            }else{
                alert('category status not updated')
            }
        })
    })
}


function categorytouppercase(){
    let a=document.querySelector('#formcategoryinput')
    a.value=a.value.toUpperCase()
}


async function productEdit(a){
    let b=await fetch(`http:///admin/category/edit/${a}`)
    b=await b.json()
    let editModal=document.querySelector('#editProduct')
    const myModal = new bootstrap.Modal(editModal, {backdrop:'static'})
    myModal.show()
    document.querySelectorAll('.editcategorybtnsub').forEach((a,i)=>{
         a.formAction=`/admin/category/edit/`+b.data._id+'/'+i
    })
    document.querySelectorAll('.x1').forEach((a)=>{
        let k=document.getElementById(a.value)
        console.log(k)
        k.disabled=true
        let label=document.querySelector(`label[for=${a.value}]`)
        label.textContent=b.data[k.name]
    })
    document.querySelectorAll('.x1').forEach((a)=>{
        a.addEventListener('change',(e)=>{
            e.stopPropagation()
            let input=document.getElementById(`${a.value}`)
            input.disabled=!a.checked
        })
    })
}