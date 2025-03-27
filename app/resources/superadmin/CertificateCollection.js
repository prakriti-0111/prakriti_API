const { isObject, isEmpty, getFileAbsulatePath } = require("@helpers/helper");
const { geStatusValue } = require("@library/common");

const CertificateCollection = (data) => {
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
        name: data.name,
        description: data.description,
        website: data.website,
        status: data.status ? 1 : 0,
        certificate_no: !isEmpty(data.certificate_no) ? data.certificate_no: '',
        status_display: geStatusValue(data.status),
        logo: !isEmpty(data.logo) ? getFileAbsulatePath(data.logo): '',
    }
    
}

module.exports = {
    CertificateCollection
}
