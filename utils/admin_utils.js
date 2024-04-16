const ExcelJS = require('exceljs');

async function create_excel_report(res,data,t,d,body){
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');
    // Add some data to the worksheet
    const head=worksheet.addRow(['SUGGO']);
    head.font = { bold: true }
    head.height=30
    head.font = { bold: true, size: 20 }; // Make header row bold and larger
    head.alignment = { vertical: 'middle', horizontal: 'center' }; // Center align header row

    worksheet.addRow(['From:', body.from]);
    worksheet.addRow(['To:', body.to]);
    worksheet.addRow([]); // Empty row for spacing

    // worksheet.columns = [
    //     { header: `Date`, key: 'date', width: 32 },
    //     { header: `Order_ID`, key: 'id', width: 32 },
    //     { header: 'Amount', key: 'amount', width: 32 },
    //     { header: `Payment Type`, key: 'method', width: 32 },
    // ];
    const columheader=worksheet.addRow(['Date', 'Order No', 'Order Amount', 'Order Type']);
    columheader.font= { bold: true }

    // data.forEach(element => {
    //     worksheet.addRow({date:String(element.date).split('T')[0] , id:element.order,amount:element.paymentamount,method:element.paymentmethod});
    // });
    data.forEach(element => {
        worksheet.addRow([String(element.date).split('T')[0] , element.order,`Rs.${element.paymentamount}`,element.paymentmethod]);
    });

    worksheet.getColumn(1).width = 25; // Date column width
    worksheet.getColumn(2).width = 25; // Order No column width
    worksheet.getColumn(3).width = 25; // Order Amount column width
    worksheet.getColumn(4).width = 25;
    // worksheet.addRow();
    // worksheet.addRow({date:`totalsales:Rs.${t[0].total}`});
    // worksheet.addRow({date:`totaldiscount:Rs.${d[0].total}`})
    worksheet.addRow();
    worksheet.addRow([`totalsales:Rs.${t[0].total}`]);
    worksheet.addRow([`totaldiscount:Rs.${d[0].total}`])
    // Set the response headers and content type
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx');

    // Write the workbook to the HTTP response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
}

module.exports={create_excel_report}