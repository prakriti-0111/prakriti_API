const db = require("@models");
const ActivityLogModel = db.activity_logs;

const {isEmpty} = require("@helpers/helper");

const addActivityLog = async (params, action, json_info) => {
    let {user, role, ip_address, lat, lng, device_type, os_name, os_version, image_path, app_version} = params;
    json_info = isEmpty(json_info) ? {} : json_info;
    image_path = isEmpty(image_path) ? "" : image_path;
    app_version = isEmpty(app_version) ? "" : app_version;
    
    await ActivityLogModel.create({
        user_id: user,
        role_id: role,
        ip_address: ip_address,
        lat: lat,
        lng: lng,
        device_type: device_type,
        os_name: os_name,
        os_version: os_version,
        //action: action,
        json_info: json_info,
        //image: image_path,
        //app_version: app_version
    });
    return true;
}

const getActivityLog = async(params) => {
    params = isEmpty(params) ? {} : params;
    return await ActivityLogModel.findAll({where: params, order:[['createdAt', 'ASC']]});
}

module.exports = {
    addActivityLog,
    getActivityLog
}