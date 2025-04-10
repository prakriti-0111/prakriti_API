const { isObject, formatDateTime, priceFormat, displayAmount, isEmpty, weightFormat, ucWords } = require("@helpers/helper");
const db = require("@models");
const SaleModel = db.sales;

const ReturnPurchaseListCollection = (data) => {
    if(isObject(data)){
        return getModelObject(data);
    }else{
        let arr = [];
        for(let i = 0; i < data.length; i++){
            arr.push(getModelObject(data[i]));
        }
        return arr;
    }
}

const getModelObject = (data) => {
    let purchase = data.purchase;

    return {
        id: data.id,
        supplier_id: purchase.supplier_id,
        supplier_name: purchase.supplier ? purchase.supplier.name : '',
        supplier_mobile: purchase.supplier ? purchase.supplier.mobile : '',
        invoice_number: purchase.invoice_number,
        invoice_date: formatDateTime(purchase.invoice_date, 9),
        return_date: data.return_date ? formatDateTime(data.return_date, 9) : '',
        return_amount: displayAmount(data.total_amount),
        bill_amount: displayAmount(purchase.bill_amount),
        status: data.status,
        status_display: ucWords(data.status)
    }

    
}

module.exports = {
    ReturnPurchaseListCollection
}
