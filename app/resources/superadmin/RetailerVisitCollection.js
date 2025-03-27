const { isObject, formatDateTime } = require("@helpers/helper");

const RetailerVisitCollection = (data) => {
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
        type: data.type,
        notes: data.notes,
        date: data.date ? formatDateTime(data.date, 8) : '',
        user_name: data.user ? data.user.name : '',
        retailer_name: data.retailer ? data.retailer.name : '',
        created_at: formatDateTime(data.createdAt, 7)
    }
}

module.exports = {
    RetailerVisitCollection
}
