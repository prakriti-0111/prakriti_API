const { isObject,getFileAbsulatePath, isEmpty, formatDateTime, weightFormat } = require("@helpers/helper");

const StockHistoriesCollection = (data) => {
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
    let materials = [], materialDisplay = [];
    for(let i = 0; i < data.materials.length; i++){
        let item = data.materials[i];
        materials.push({
            id: item.id,
            material_id: item.material_id,
            material_name: item.material ? item.material.name : '',
            weight: weightFormat(item.weight),
            quantity: item.quantity ? item.quantity : 0,
            unit_id: item.unit_id,
            unit_name: (item.unit) ? item.unit.name : ''
        });
        let material = item.material;
        let str = (material ? material.name : '') + ' - ' + weightFormat(item.weight) +((item.unit) ? (' '+item.unit.name) : '') + ' - ' + item.quantity;
        materialDisplay.push(str);
    }


    return {
        id: data.id,
        batch_id: data.batch_id,
        from_user_id: data.from_user_id,
        to_user_id: data.to_user_id,
        from_user_name: data.fromUser ? data.fromUser.name : '',
        to_user_name: data.toUser ? data.toUser.name : '',
        type: data.type,
        materials: materials,
        date: formatDateTime(data.date, 8),
        editable_date: formatDateTime(data.date, 9),
        materials_display: materialDisplay
        
    }
}

module.exports = {
    StockHistoriesCollection
}
