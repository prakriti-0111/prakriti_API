const { isObject,getFileAbsulatePath, isEmpty, formatDateTime, weightFormat } = require("@helpers/helper");

const WorkerStockCollection = (data) => {
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
        material_id: data.material_id,
        material_name: data.material ? data.material.name : '',
        outstanding_weight: weightFormat(data.outstanding_weight),
        outstanding_qty: data.outstanding_qty,
        unit_id: data.unit_id,
        unit_name: (data.unit) ? data.unit.name : ''
    }
}

module.exports = {
    WorkerStockCollection
}
