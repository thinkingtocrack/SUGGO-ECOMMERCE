const PdfTable = require('voilab-pdf-table')
const PdfDocument = require('pdfkit');
const fs=require('fs')

function createpdf(data,date,total,discount) {
    // create a PDF from PDFKit, and a table from PDFTable
    var pdf = new PdfDocument({
            autoFirstPage: false
        }),
        table = new PdfTable(pdf, {
            bottomMargin: 30,
        });
    table
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
            column: 'Date'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
            headerBorder: 'B',
            align: 'right',
        })
        // add table columns
        .addColumns([
            {
                id: 'Date',
                header: 'Date',
                align: 'left'
            },
            {
                id: 'Order_id',
                header: 'Order_id',
                width: 60
            },
            {
                id: 'Total_Amount',
                header: 'Total-Amount',
                width: 100
            },
            {
                id: 'Payment_method',
                header: 'Payment-Method',
                width: 60
            }
        ])
        // add events (here, we draw headers on each new page)
        .onPageAdded(function (tb) {
            tb.addHeader();
        });

    // if no page already exists in your PDF, do not forget to add one
    pdf.addPage();
    pdf.fontSize(25).text('Order Report',{align:'center'})
    pdf.moveDown();
    pdf.text('')
    pdf.fontSize(15).text(`From:${date.from}`,{align:'Left'})
    pdf.fontSize(15).text(`To:${date.to}`,{align:'Left'})
    pdf.moveDown();
    pdf.text('')
    pdf.fontSize(12)

    table.addBody(data.map(e=>{
        return {Date:String(e.date).split('T')[0],Order_id:e.order,Total_Amount:`Rs.${e.paymentamount}`,Payment_method:e.paymentmethod}
    }));

    pdf.moveDown();
    pdf.text('')
    pdf.moveDown();
    pdf.fontSize(12).text(`Total-Amount:Rs.${total[0].total}`,80)
    pdf.fontSize(12).text(`Total-Discount:Rs.${discount[0].total}`,80)

    return pdf;
}


module.exports={createpdf}