function deleteProduct(a){
    const myModal = new bootstrap.Modal(document.getElementById('deleteModal'),{backdrop:'static'})
    myModal.show()
    document.getElementById('deleteProductBtn').addEventListener('click',(e)=>{
        e.stopPropagation();
        fetch(`https://suggo.shop/admin/product/deleteproduct/${a}`)
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
        fetch('https://suggo.shop/admin/product/status',{
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
                alert('product status not updated')
            }
        })
    })
}


// function previewFiles() {
//     const preview = document.querySelector("#selectedImage");
//     const files = document.querySelector("#formFileMultiple1").files;
//     preview.innerHTML=''
//     function readAndPreview(file,i) {
//     const reader = new FileReader();
//     reader.addEventListener(
//         "load",
//         () => {
//         const newSpan = document.createElement('span');
//         newSpan.classList.add('imagespan');
//         const newbutton=document.createElement('button')
//         newbutton.classList.add('btn-close')
//         newbutton.addEventListener('click',(e)=>{
//             e.stopPropagation()
//             fileremoval(i,'formFileMultiple')
//             previewFiles()
//         })
//         const image = new Image()
//         image.title = file.name;
//         image.src = reader.result;
//         newSpan.appendChild(image);
//         newSpan.appendChild(newbutton)
//         preview.appendChild(newSpan);
//         },
//         false,
//     );

//     reader.readAsDataURL(file);
// }

// if (files) {
// Array.prototype.forEach.call(files, readAndPreview);
// }
// }

// const picker = document.querySelector("#formFileMultiple1");
// picker.addEventListener("change", previewFiles);


function previewFiles(a,b) {
    const preview = document.querySelector(a);
    const files = document.querySelector(b).files;
    preview.innerHTML=''
    function readAndPreview(file,i) {
    const reader = new FileReader();
    reader.addEventListener(
        "load",
        () => {
        const newSpan = document.createElement('span');
        newSpan.classList.add('imagespan');
        const newbutton=document.createElement('button')
        newbutton.classList.add('btn-close')
        newbutton.addEventListener('click',(e)=>{
            e.stopPropagation()
            fileremoval(i,b)
            previewFiles(a,b)
        })
        const image = new Image()
        image.title = file.name;
        image.src = reader.result;
        newSpan.appendChild(image);
        newSpan.appendChild(newbutton)
        preview.appendChild(newSpan);
        },
        false,
    );

    reader.readAsDataURL(file);
}

if (files) {
Array.prototype.forEach.call(files, readAndPreview);
}
}

function pre(selid,fileid){
    const picker = document.querySelector(fileid);
    picker.addEventListener("change", ()=>{
    previewFiles(selid,fileid)
});
}

pre('#selectedImage',"#formFileMultiple1")
pre('#selectedImage2',"#formFileMultiple2")
pre('#selectedImage3',"#formFileMultiple3")





async function productEdit(a){
    document.querySelector('#editProductform').action=`/admin/product/edit/${a}`
    let b=await fetch(`https://suggo.shop/admin/product/edit/${a}`)
    b=await b.json()
    let editModal=document.querySelector('#editProduct')
    const myModal = new bootstrap.Modal(editModal, {backdrop:'static'})
    myModal.show()
    document.querySelectorAll('.x1').forEach((a)=>{
        let k=document.getElementById(a.value)
        k.disabled=true
    })
    const vbtn=document.querySelector('#editvarientbtn')
    vbtn.addEventListener('click',(e)=>{
        e.stopPropagation()
        varientedit(b)
    })
    document.querySelectorAll('.x1').forEach((a)=>{
        a.addEventListener('change',(e)=>{
            e.stopPropagation()
            let input=document.getElementById(`${a.value}`)
            input.disabled=!a.checked
        })
    })
}

function turnon(){
    let a=document.querySelectorAll('.y')
    let yc=document.querySelectorAll('.yc')
    a.forEach((el,i)=>{
        el.addEventListener('change',(e)=>{
            e.stopPropagation()
            yc[i].disabled=!e.target.checked
        })
    })
}


function varientedit(b){
    let editModal=document.querySelector('#varienteditmodal')
    const myModal = new bootstrap.Modal(editModal, {backdrop:'static'})
    myModal.show()
    document.querySelector('#varientformx').action=`/admin/product/edit/varientedit/${b.data.productId}`
    const varientbody=document.querySelector('.varientbody select')
    varientbody.innerHTML=''
    b.data.varient.forEach((element)=>{
        varientbody.innerHTML+=`<option value="${element.id}">${b.data.productname}-${element.color}</option>`
    })
    varientbody.addEventListener('change',(e)=>{
        e.stopPropagation()
        addacc(e.target.value,b.data)
    })
    addacc(b.data.varient[0].id,b.data)
    turnon()
}
function addacc(id,d){
    d.varient.forEach(e=>{
        if(e.id==id){
            document.getElementById('deletevarientform').action=`/admin/product/deletevarient/${d.productId}/${id}`
            const acc=document.querySelectorAll('.accordion-body')
            acc[0].innerHTML=e.color
            acc[1].innerHTML=e.price
            acc[2].innerHTML=e.stock
            acc[3].innerHTML=e.productdetails
            let p=''
            e.image.forEach(x=>{
                p+=`<img style='height:200px;width:200px'  src="https://suggo.shop/uploads/${x}" alt="">`
            })
            acc[4].innerHTML=p
            document.getElementById('flexSwitchCheckDefault').checked=e.status
        }
    })
}







function fileremoval(i,b){
    let fileInput = document.querySelector(b);
    let selectedFiles = fileInput.files;
    if (selectedFiles.length > 0) {
    let fileToRemove = selectedFiles[i];
    let updatedFiles = Array.from(selectedFiles).filter(file => file !== fileToRemove);
    let newFileList = new DataTransfer();
    updatedFiles.forEach(file => newFileList.items.add(file));
    fileInput.files = newFileList.files;
    }
     
}

function newVarient(a){
    let form=document.querySelectorAll(".newvarientbtnform")
    form.forEach((e,i)=>e.formAction=`/admin/product/newvarient/${a}/${i}`)
    let editModal=document.querySelector('#newVarient')
    const myModal = new bootstrap.Modal(editModal, {backdrop:'static'})
    myModal.show()
}


function minfile(id){
    let file=document.getElementById(id)
    if(file.disabled==true){
        return true
    }
    if(file.files.length<3){
        alert('add min 3 image')
        return false
    }else{
        return true
    }
}