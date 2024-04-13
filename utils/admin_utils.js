const ExcelJS = require('exceljs');

async function create_excel_report(res,data,type,t,d){
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    // Add some data to the worksheet
    worksheet.columns = [
        { header: `${type}`, key: 'date', width: 32 },
        { header: 'Sales(no of items sold)', key: 'sales', width: 32 },
    ];

    data.forEach(element => {
        worksheet.addRow({date:element._id , sales:element.count});
    });
    worksheet.addRow();
    worksheet.addRow({date:`totalsales:${t[0].total}` , sales:`totaldiscount:${d[0].total}`});
    // Set the response headers and content type
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx');

    // Write the workbook to the HTTP response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
}

module.exports={create_excel_report}