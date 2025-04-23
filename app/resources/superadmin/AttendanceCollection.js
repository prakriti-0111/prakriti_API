const { isObject, formatDateTime, isEmpty, getFileAbsulatePath, getFormatedAddress } = require("@helpers/helper");


const AttendanceCollection = (data) => {
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
    let display_explanation = '';
    
    if(!isEmpty(data.explanation)){
        display_explanation = data.explanation.charAt(0).toUpperCase() + data.explanation.slice(1);
    }

    return {
        id: data.id,
        user_id: !isEmpty(data.user_id) ? data.user_id: '',
        date: !isEmpty(data.createdAt) ? formatDateTime(data.createdAt, 10) : '',
        date_time: !isEmpty(data.createdAt) ? formatDateTime(data.createdAt, 7) : '',
        status: data.status,
        late_reason: !isEmpty(data.late_reason) ? data.late_reason: '',
        image: !isEmpty(data.image) ? getFileAbsulatePath(data.image): '',
        type: data.type,
        address: !isEmpty(data.address) ? data.address : getFormatedAddress(data),
        lat: !isEmpty(data.lat) ? data.lat: '',
        lng: !isEmpty(data.lng) ? data.lng: '',
    }
}

module.exports = {
    AttendanceCollection
}
