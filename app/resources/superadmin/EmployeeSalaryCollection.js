const { isObject, formatDateTime, isEmpty, priceFormat } = require("@helpers/helper");


const EmployeeSalaryCollection = (data) => {
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
    let is_epf = '';
    let is_medical = '';

    if(data.is_epf >= 0){
        is_epf = (data.is_epf == 0) ? 'Yes' : 'No';
    }

    if(data.is_medical >= 0){
        is_medical = (data.is_medical == 0) ? 'Yes' : 'No';
    }

    return {
        id: data.id,
        role_id: !isEmpty(data.role_id) ? data.role_id: '',
        user_id: !isEmpty(data.user_id) ? data.user_id: '',
        gross_salary: !isEmpty(data.gross_salary) ? data.gross_salary: '',
        basic_salary: !isEmpty(data.basic_salary) ? data.basic_salary: '',
        eff_date: !isEmpty(data.eff_date) ? formatDateTime(data.eff_date, 9) : '',
        eff_date_display: !isEmpty(data.eff_date) ? formatDateTime(data.eff_date, 8) : '',
        is_epf: data.is_epf,
        is_medical: data.is_medical,
        display_is_epf: is_epf,
        display_is_medical: is_medical,
        target: !isEmpty(data.target) ? data.target: '',
        visit_target: !isEmpty(data.visit_target) ? data.visit_target: '',
        incentive: !isEmpty(data.incentive) ? data.incentive : '',
        incentive_display: !isEmpty(data.incentive) ? (priceFormat(data.incentive, true) + ' %') : '',
        hra_percent: !isEmpty(data.hra_percent) ? data.hra_percent : '',
        conv_percent: !isEmpty(data.conv_percent) ? data.conv_percent : '',
        epf_employee_percent: !isEmpty(data.epf_employee_percent) ? data.epf_employee_percent : '',
        epf_employer_percent: !isEmpty(data.epf_employer_percent) ? data.epf_employer_percent : '',
        medical_employee_percent: !isEmpty(data.medical_employee_percent) ? data.medical_employee_percent : '',
        medical_employer_percent: !isEmpty(data.medical_employer_percent) ? data.medical_employer_percent : '',
        hra_percent_display: !isEmpty(data.hra_percent) ? (priceFormat(data.hra_percent, true) + ' %') : '',
        conv_percent_display: !isEmpty(data.conv_percent) ? (priceFormat(data.conv_percent, true) + ' %') : '', epf_employee_percent_display: !isEmpty(data.epf_employee_percent) ? (priceFormat(data.epf_employee_percent, true) + ' %') : '',medical_employee_percentt_display: !isEmpty(data.medical_employee_percent) ? (priceFormat(data.medical_employee_percent, true) + ' %') : '',
    }
}

module.exports = {
    EmployeeSalaryCollection
}
