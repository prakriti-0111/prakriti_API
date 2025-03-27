const { isObject, getFileAbsulatePath, isEmpty, isArray, upperCase } = require("@helpers/helper");


const EmployeeCollection = (data) => {
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
    let documents = [];
    if(isArray(data.documents)){
        for(let i = 0; i < data.documents.length; i++){
            documents.push({
                file_name: data.documents[i].file_name,
                path: getFileAbsulatePath(data.documents[i].path),
            })
        }
    }
    let parent_user_name = ('parent' in data && data.parent) ? data.parent.name : '';
    let weekly_holidays = data.weekly_holidays ? data.weekly_holidays : {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
    }
    let display_weekly_holidays = [];
    for(let i of Object.keys(weekly_holidays)){
        if(weekly_holidays[i]){
            display_weekly_holidays.push(upperCase(i));
        }
    }
    display_weekly_holidays = display_weekly_holidays.join(", ");

    return {
        id: data.id,
        role_id: data.role_id,
        role_name: data.role ? data.role.name : '',
        user_name: data.user_name || '',
        name: data.name,
        parent_id: data.parent_id,
        email: data.email || '',
        mobile: data.mobile,
        adhar: data.adhar || '',
        pan: data.pan || '',
        address: data.address || '',
        city: data.city || '',
        landmark: data.landmark || '',
        pincode: data.pincode || '',
        district_id: data.district_id || '',
        state_id: data.state_id || '',
        country_id: data.country_id || '',
        created_by: data.createdBy?data.createdBy.name : '',
        p_address: data.p_address || '',
        p_city: data.p_city || '',
        p_pincode: data.p_pincode || '',
        p_district_id: data.p_district_id || '',
        p_state_id: data.p_state_id || '',
        p_country_id: data.p_country_id || '',
        company_name: data.company_name || '',
        blood_group: data.blood_group || '',
        gst: data.gst || '',
        bank_name: data.bank_name || '',
        bank_account_no: data.bank_account_no || '',
        bank_ifsc: data.bank_ifsc || '',
        branch_name: data.branch_name || '',
        profile_image: (!isEmpty(data.profile_image)) ? getFileAbsulatePath(data.profile_image) : '',
        pan_image: (!isEmpty(data.pan_image)) ? getFileAbsulatePath(data.pan_image) : '',
        adhar_image: (!isEmpty(data.adhar_image)) ? getFileAbsulatePath(data.adhar_image) : '',
        company_logo: (!isEmpty(data.company_logo)) ? getFileAbsulatePath(data.company_logo) : '',
        status: data.status ? 1 : 0,
        district_name: data.district ? data.district.name : '',
        state_name: data.state ? data.state.name : '',
        country_name: data.country ? data.country.name : '',
        status_display: data.status ? 'Active' : 'Inactive',
        documents: documents,
        parents_name: data.parents_name || '',
        parents_contact_no: data.parents_contact_no || '',
        parent_user_name: parent_user_name,
        weekly_holidays: weekly_holidays,
        display_weekly_holidays: display_weekly_holidays
    }
}

module.exports = {
    EmployeeCollection
}
