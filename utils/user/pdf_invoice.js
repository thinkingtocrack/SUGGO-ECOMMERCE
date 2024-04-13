//Import the library into your project
var easyinvoice = require('easyinvoice');
let fs=require('fs')

const createpdf=async(orderdata)=>{
    var data = {
        apiKey: "free", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
        mode: "development", // Production or development, defaults to production   
        images: {
            // The logo on top of your invoice
            logo: fs.readFileSync('./public/logo/logo.png', 'base64'),
            // The invoice background
            // background: "https://public.budgetinvoice.com/img/watermark-draft.jpg"
        },
        // Your own data
        sender: {
            company: "SUGO",
            address: "Sample Street 123",
            zip: "686631",
            city: "KOTTAYAM",
            country: "INDIA"
        },
        // Your recipient
        client: {
            company: `${orderdata.address.fullname}`,
            address: `${orderdata.address.address}`,
            zip: `${orderdata.address.zip}`,
            city: `${orderdata.address.city}`,
            country: "india"
            // custom1: "custom value 1",
            // custom2: "custom value 2",
            // custom3: "custom value 3"
        },
        information: {
            // Invoice number
            number: `${orderdata.order}`,
            // Invoice data
            date: `${orderdata.date}`,
            // Invoice due date
        },
        // The products you would like to see on your invoice
        // Total values are being calculated automatically
        products: orderdata.items.map(e=>{
            return {
                quantity: Number(e.qty),
                description: `${e.productname}`,
                price: Number(e.varient.price)
            }
        }),
        // Settings to customize your invoice
        settings: {
            currency: "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
            // locale: "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')        
            // marginTop: 25, // Defaults to '25'
            // marginRight: 25, // Defaults to '25'
            // marginLeft: 25, // Defaults to '25'
            // marginBottom: 25, // Defaults to '25'
            // format: "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
            // height: "1000px", // allowed units: mm, cm, in, px
            // width: "500px", // allowed units: mm, cm, in, px
            // orientation: "landscape" // portrait or landscape, defaults to portrait
        },
        // Translate your invoice to your preferred language
        translate: {
            // invoice: "FACTUUR",  // Default to 'INVOICE'
            // number: "Nummer", // Defaults to 'Number'
            // date: "Datum", // Default to 'Date'
            // dueDate: "Verloopdatum", // Defaults to 'Due Date'
            // subtotal: "Subtotaal", // Defaults to 'Subtotal'
            // products: "Producten", // Defaults to 'Products'
            // quantity: "Aantal", // Default to 'Quantity'
            // price: "Prijs", // Defaults to 'Price'
            // productTotal: "Totaal", // Defaults to 'Total'
            // total: "Totaal", // Defaults to 'Total'
            // taxNotation: "btw" // Defaults to 'vat'
        },

        // Customize enables you to provide your own templates
        // Please review the documentation for instructions and examples
        // "customize": {
        //      "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
        // }
    };

    //Create your invoice! Easy!
    const result = await easyinvoice.createInvoice(data);
    return result
}


module.exports={createpdf}