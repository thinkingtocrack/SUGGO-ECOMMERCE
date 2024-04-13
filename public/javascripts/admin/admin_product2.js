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




async function productEdit(a){
    let b=await fetch(`https://suggo.shop/admin/product/edit/${a}`)
    b=await b.json()
    let editModal=document.querySelector('#editProduct')
    const myModal = new bootstrap.Modal(editModal, {backdrop:'static'})
    myModal.show()
    document.querySelectorAll('.editproductbtnsub').forEach((a,i)=>{
         a.formAction=`/admin/product/edit/${i}/`+b.data._id
    })
    document.querySelectorAll('.x1').forEach((a)=>{
        let k=document.getElementById(a.value)
        k.disabled=true
        if(a.value!='productfile'){
            let label=document.querySelector(`label[for=${a.value}]`)
            label.textContent=b.data[k.name]
        }
    })
    document.querySelectorAll('.x1').forEach((a)=>{
        a.addEventListener('change',(e)=>{
            e.stopPropagation()
            let input=document.getElementById(`${a.value}`)
            input.disabled=!a.checked
        })
    })
}





function fileremoval(i,b){
    let fileInput = b;
    let selectedFiles = fileInput.files;
    if (selectedFiles.length > 0) {
      let fileToRemove = selectedFiles[i];
      let updatedFiles = Array.from(selectedFiles).filter(file => file !== fileToRemove);
      let newFileList = new DataTransfer();
      updatedFiles.forEach(file => newFileList.items.add(file));
      fileInput.files = newFileList.files;
    }
     
}




function addVarient(){
    let listgroup=document.querySelector('#linkgroupnew')
    const newlist=document.createElement('li')
    newlist.classList.add('list-group-item')
    let newvarient=`
    <button type="button" class="btn-close" onclick="deletebox(this)" aria-label="Close"></button>
    <div class="input-group mb-3 varientip">
      <span class="input-group-text" id="addon-wrapping">color</span>
      <input multiple name="color[]" type="text" class="form-control" placeholder="Color" required>
    </div>
    <div class="input-group mb-3 varientip">
      <span class="input-group-text" id="basic-addon1">stock</span>
      <input multiple name='stock[]' type="number" class="form-control" placeholder="stock" required>
    </div>
    <div class="input-group mb-3 varientip">
      <span class="input-group-text" id="basic-addon1">price</span>
      <input multiple name='price[]' type="number" class="form-control" placeholder="price" required>
    </div>
    <div class="input-group mb-3 varientip">
      <input multiple accept="image/*" name="testImage" onchange="px(this)" type="file" class="form-control inputx" required>
    </div>
    <div class='selectedimg'></div>
    <input multiple name='imagenum[]' type="number" hidden id='hiddeninputx'>
    `
    newlist.innerHTML=newvarient
    listgroup.appendChild(newlist)
}

function deletebox(button){
    button.parentNode.remove()
}


function addnumber(a){
    if(a.value==''){
        a.value=1
    }else{
        a.value=Number(a.value)+1
    }
}


function previewFiles(a,b) {
    a.nextElementSibling.value=''
    const preview = a
    const files = b.files;
    preview.innerHTML=''
    function readAndPreview(file,i) {
    const reader = new FileReader();
    reader.addEventListener(
        "load",
        () => {
        addnumber(a.nextElementSibling)
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

function px(a){
        let parent=a.parentNode
        let c=parent.nextElementSibling
        previewFiles(c,a)
}