const ExcelJS = require('exceljs');

async function create_excel_report(res,data,t,d){
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');


    // Add some data to the worksheet
    worksheet.columns = [
        { header: `Date`, key: 'date', width: 32 },
        { header: `Order_ID`, key: 'id', width: 32 },
        { header: 'Amount', key: 'amount', width: 32 },
        { header: `Payment Type`, key: 'method', width: 32 },
    ];

    data.forEach(element => {
        worksheet.addRow({date:String(element.date).split('T')[0] , id:element.order,amount:element.paymentamount,method:element.paymentmethod});
    });
    worksheet.addRow();
    worksheet.addRow({date:`totalsales:Rs.${t[0].total}`});
    worksheet.addRow({date:`totaldiscount:Rs.${d[0].total}`})
    // Set the response headers and content type
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx');

    // Write the workbook to the HTTP response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
}

module.exports={create_excel_report}