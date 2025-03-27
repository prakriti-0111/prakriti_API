const { isObject, isEmpty, displayAmount, priceFormat, formatDateTime, paymentModeDisplay } = require("@helpers/helper");

const SalaryCollection = (data) => {
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
    let address = '';
    if(data.user){
        address = [];
        if(data.user.city){
            address.push(data.user.city);
        }
        if(data.user.district){
            address.push(data.user.district.name);
        }
        if(data.user.state){
            address.push(data.user.state.name);
        }
        if(data.user.country){
            address.push(data.user.country.name);
        }
        address.push(data.user.pincode);
        address = address.join(", ");
    }
    let display_date = data.type == 'salary' ? formatDateTime(data.salary_date, 11) : formatDateTime(data.createdAt, 8)

    return {
        id: data.id,
        user_id: data.user_id,
        user_name: data.user ? data.user.name : '',
        user_mobile: data.user ? data.user.mobile : '',
        user_city: data.user ? data.user.city : '',
        user_email: data.user ? (data.user.email ?? "") : '',
        user_pincode: data.user ? data.user.pincode : '',
        advance_amount: data.user ? displayAmount(data.user.advance_amount) : "",
        due_amount: data.user ? displayAmount(data.user.due_amount) : "",
        user_address: address,
        role_name: data.user && data.user.role ? data.user.role.display_name : '',
        absent: data.absent,
        work_days: data.work_days,
        gross: displayAmount(data.gross),
        wages: displayAmount(data.wages),
        basic: displayAmount(data.basic),
        hra: displayAmount(data.hra),
        conveyance: displayAmount(data.conveyance),
        special: displayAmount(data.special),
        ptax: displayAmount(data.ptax),
        epf_employee: displayAmount(data.epf_employee),
        epf_employer: displayAmount(data.epf_employer),
        medical_employee: displayAmount(data.medical_employee),
        medical_employer: displayAmount(data.medical_employer),
        actual_gross: displayAmount(data.actual_gross),
        actual_basic: displayAmount(data.actual_basic),
        absent_amount: displayAmount(data.absent_amount),
        net: displayAmount(data.net),
        total_display: displayAmount(data.total),
        total: priceFormat(data.total),
        total_deduction: displayAmount(priceFormat(parseFloat(data.epf_employee) + parseFloat(data.absent_amount) + parseFloat(data.ptax) + parseFloat(data.medical_employee))),
        is_epf: data.is_epf,
        is_medical: data.is_medical,
        salary_date: formatDateTime(data.salary_date, 11),
        status: data.status,
        checked: false,
        incentive: displayAmount(data.incentive),
        paid_amount: displayAmount(data.paid_amount),
        incentive_percent: priceFormat(data.incentive_percent, true),
        incentive_on: displayAmount(data.incentive_on),
        type: data.type,
        payment_mode: paymentModeDisplay(data.payment_mode),
        txn_id: data.txn_id,
        cheque_no: data.cheque_no,
        display_date: display_date
    }
}

module.exports = {
    SalaryCollection
}
