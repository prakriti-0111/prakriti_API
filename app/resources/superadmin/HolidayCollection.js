const { isObject, formatDateTime } = require("@helpers/helper");

const HolidayCollection = (data) => {
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
        date: formatDateTime(data.date, 9),
        date_display: formatDateTime(data.date, 8)
    }
}

module.exports = {
    HolidayCollection
}
