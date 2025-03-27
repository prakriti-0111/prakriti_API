const { isObject, isEmpty, ucWords, shortString, formatDateTime } = require("@helpers/helper");
const striptags = require('striptags');

const LeaveApplicationCollection = (data) => {
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
        user_id: data.user_id,
        status: data.status,
        status_display: ucWords(data.status),
        title: data.title,
        message: data.message,
        short_message: shortString((data.message).replace(/<\/?[^>]+>/gi, '')),
        user_name: !isEmpty(data.user) ? data.user.name: '',
        role: !isEmpty(data.user)&& !isEmpty(data.user.role) ? data.user.role.display_name: '',
        from_date: formatDateTime(data.from_date, 8),
        to_date: formatDateTime(data.to_date, 8),
        created_at: formatDateTime(data.createdAt, 7),
        explanation: data.explanation

    }
}

module.exports = {
    LeaveApplicationCollection
}
