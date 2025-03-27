const { isObject, formatDateTime, ucWords, displayAmount, priceFormat } = require("@helpers/helper");

const PurchaseCollection = (data) => {
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
    let products = [];
    for(let i = 0; i < data.saleProducts.length; i++){
        let item = data.saleProducts[i];
        let materials = [];
        for(let x = 0; x < item.saleMaterials.length; x++){
            let thisM = item.saleMaterials[x];
            materials.push({
                id: thisM.id,
                material_id: thisM.material_id,
                material_name: thisM.material ? thisM.material.name : '',
                weight: thisM.weight,
                quantity: thisM.quantity,
                unit_name: (thisM.unit) ? thisM.unit.name : '',
                purity_id: thisM.purity_id,
                purity_name: thisM.purity ? thisM.purity.name : '',
                unit_id: thisM.unit_id,
                rate_display: displayAmount(thisM.rate),
                rate: priceFormat(thisM.rate),
                amount: displayAmount(thisM.amount),
                discount_amount: priceFormat(thisM.discount_amount),
                discount_amount_display: displayAmount(thisM.discount_amount),
                discount_percent: thisM.discount_percent,
            });
            
        }

        products.push({
            product_name: item.product ? item.product.name : '',
            product_type: item.product ? item.product.type : '',
            product_code: item.product ? item.product.product_code : '',
            category_name: (item.product && item.product.category) ? item.product.category.name : '',
            size_name: item.size ? item.size.name : '',
            certificate_no: item.certificate_no,
            total_weight: item.total_weight,
            sub_price: displayAmount(item.sub_price),
            making_charge: priceFormat(item.making_charge),
            making_charge_discount: priceFormat(item.making_charge_discount),
            making_charge_discount_amount: priceFormat(item.making_charge_discount_amount),
            making_charge_display: displayAmount(item.making_charge),
            rep: displayAmount(item.rep),
            tax: displayAmount(item.tax),
            total: priceFormat(item.total),
            total_display: displayAmount(item.total),
            total_discount: priceFormat(item.total_discount),
            total_discount_display: displayAmount(item.total_discount),
            materials: materials,
            total_making_charge_discount: priceFormat(priceFormat(item.making_charge) - priceFormat(item.making_charge_discount_amount))
        });

    }
    let approve_status = 'Pending';
    if(data.is_approved == 1){
        approve_status = "Accepted";
    }else if(data.is_approved == 2){
        approve_status = "Declined";
    }
    return {
        id: data.id,
        user_id: data.id,
        user_name: data.user ? data.user.name : '',
        user_mobile: data.user ? data.user.mobile : '',
        user_details: {
            id: data.user_id,
            company_name: (data.user && data.user.company_name) ? data.user.company_name : '',
            gst: (data.user && data.user.gst) ? data.user.gst : '',
            address: (data.user && data.user.address) ? data.user.address : '',
            city: (data.user && data.user.city) ? data.user.city : '',
            company_name: (data.user && data.user.company_name) ? data.user.company_name : '',
            pincode: (data.user && data.user.pincode) ? data.user.pincode : '',
        },
        invoice_number: data.invoice_number,
        invoice_date: formatDateTime(data.invoice_date, 8),
        //due_date: formatDateTime(data.due_date, 8),
        settlement_date: formatDateTime(data.settlement_date, 8),
        cgst_tax: displayAmount(data.cgst_tax),
        sgst_tax: displayAmount(data.sgst_tax),
        igst_tax: displayAmount(data.igst_tax),
        discount: displayAmount(data.discount),
        total_amount: displayAmount(data.total_amount),
        payment_mode: data.payment_mode,
        transaction_no: data.transaction_no,
        notes: data.notes,
        taxable_amount: displayAmount(data.taxable_amount),
        total_payable: displayAmount(data.total_payable),
        due_amount: priceFormat(data.due_amount),
        due_amount_display: displayAmount(data.due_amount),
        due_date: data.status != "paid" ? formatDateTime(data.due_date, 8) : '',
        paid_amount: displayAmount(data.paid_amount),
        total_tag_price: displayAmount(data.total_tag_price),
        product_discount: displayAmount(data.product_discount),
        status: data.status,
        status_display: ucWords(data.status),
        products: products,
        approve_status: approve_status
    }
}

module.exports = {
    PurchaseCollection
}
