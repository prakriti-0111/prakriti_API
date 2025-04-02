const { isObject, getFileAbsulatePath, isEmpty, formatDateTime, getNotificationRedirectUrl } = require("@helpers/helper");

const NotificationCollection = (data) => {
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
    let redirect_url = getNotificationRedirectUrl(data.type, data.params);
    let params = JSON.parse(data.params);
    return {
        id: data.id,
        user_id: data.user_id,
        type: data.type,
        message: data.message,
        redirect_url: redirect_url,
        created_at: formatDateTime(data.createdAt, 7),
        is_read: data.is_read,
        params: params,
        type_id: data.type_id
    }
}

module.exports = {
    NotificationCollection
}
