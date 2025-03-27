const { isObject, getFileAbsulatePath, isEmpty } = require("@helpers/helper");


const WorkerCollection = (data) => {
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
    return {
        id: data.id,
        manager_id: !isEmpty(data.parent_id) ? data.parent_id : '',
        manager_name: !isEmpty(data.parent) ? data.parent.name: '',
        name: data.name,
        email: data.email || '',
        mobile: data.mobile,
        adhar: data.adhar || '',
        pan: data.pan || '',
        address: data.address || '',
        city: data.city || '',
        pincode: data.pincode || '',
        district_id: data.district_id || '',
        state_id: data.state_id || '',
        country_id: data.country_id || '',
        p_address: data.p_address || '',
        p_city: data.p_city || '',
        p_pincode: data.p_pincode || '',
        p_district_id: data.p_district_id || '',
        p_state_id: data.p_state_id || '',
        p_country_id: data.p_country_id || '',
        company_name: data.company_name || '',
        gst: data.gst || '',
        bank_name: data.bank_name || '',
        bank_account_no: data.bank_account_no || '',
        bank_ifsc: data.bank_ifsc || '',
        profile_image: (!isEmpty(data.profile_image)) ? getFileAbsulatePath(data.profile_image) : '',
        pan_image: (!isEmpty(data.pan_image)) ? getFileAbsulatePath(data.pan_image) : '',
        adhar_image: (!isEmpty(data.adhar_image)) ? getFileAbsulatePath(data.adhar_image) : '',
        company_logo: (!isEmpty(data.company_logo)) ? getFileAbsulatePath(data.company_logo) : '',
        status: data.status,
        district_name: data.district ? data.district.name : '',
        state_name: data.state ? data.state.name : '',
        country_name: data.country ? data.country.name : '',
        status_display: data.status ? 'Active' : 'Inactive'
    }
}

module.exports = {
    WorkerCollection
}
