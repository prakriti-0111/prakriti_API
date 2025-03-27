const { isObject, isEmpty } = require("@helpers/helper");
const { geStatusValue } = require("@library/common");

const LeaveCollection = (data) => {
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
    let leaveObj = {
        id: data.id,
        user_id: data.userId,
        status: data.status,
        title: data.title,
        message: data.message,
    };

    return leaveObj;
}

module.exports = {
    LeaveCollection
}
