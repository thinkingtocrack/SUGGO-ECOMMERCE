document.getElementById('orderform').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Gather form data
    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });
    fetch('/user/createorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();

    })
    .then(data => {
        if(jsonData.payment=='cod' || data.payment<=0){
            location.href=data.link
        }else{
            openpay(data)
        }
        // Handle response data
    })
    .catch(error => {
        // Handle errors
        document.querySelector('#placeorder').disabled=false
        console.error('There was a problem with your fetch operation:', error);
    });
});
function openpay(data){
    var options = {
        "key": "rzp_test_TREdDxWxdFJkyI", // Enter the Key ID generated from the Dashboard
        "amount": `${data.amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "SUGO", //your business name
        "description": "Test Transaction",
        "image": "/favicon/favicon.ico",
        "order_id": `${data.id}`, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            response.orderid=data.receipt
            payverifiy(response)
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": `${data.user.name}`, //your customer's name
            "email": `${data.user.email}`, 
            "contact": `${data.user.phone}`  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "SUGO Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        },
        "modal": {
            "ondismiss": function(){
                location.href=`/user/account/order/${data.receipt}`
            }
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', function (response){
        console.log(response.error.metadata.order_id)
    });
}
async function payverifiy(data){
    let paymentStatus=await fetch('/auth/paymentverify',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    paymentStatus=await paymentStatus.json()
    if(paymentStatus.status){
        location.href=`/user/account/order/${data.orderid}`
    }else{
        alert('payment failed')
    }

}