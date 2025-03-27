const { isObject, formatDateTime } = require("@helpers/helper");

const SubscriberCollection = (data) => {
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
        name: data.name ?? "",
        email: data.email ?? "",
        mobile: data.mobile ?? "",
        created_at: formatDateTime(data.createdAt, 7),
        event: data.event ?? ""
    }
}

module.exports = {
    SubscriberCollection
}
