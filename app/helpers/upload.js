const fs = require('fs');
const {isArray} = require("./helper");
const uuidv4 = require('uuid/v4');

const base64FileUpload = (file, filepath) => {
    try {
        const file_path = 'public/uploads/'+filepath;
        if (!fs.existsSync(file_path)){
            fs.mkdirSync(file_path);
        }
        let extension = file.split(';')[0].split('/')[1];
        const file_name = uuidv4()+'.' + extension;
        const path = file_path+'/'+file_name;
        const base64Data = file.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFileSync(path, base64Data,  {encoding: 'base64'});
        return {file_name: file_name, path: path};
    } catch (e) {
        return false;
    }
}

const base64VideoFileUpload = (file, filepath) => {
    try {
        const file_path = 'public/uploads/'+filepath;
        if (!fs.existsSync(file_path)){
            fs.mkdirSync(file_path);
        }
        const file_name = Date.now()+'.mp4';
        const path = file_path+'/'+file_name;

        file = file.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
        const base64Data = file.replace(/ /g, '+');

        //const base64Data = file.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFileSync(path, base64Data,  {encoding: 'base64'});
        return {file_name: file_name, path: path};
    } catch (e) {
        return false;
    }
}

const removeFile = (filepath) => {
    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            return true;
        }else{
            return false;
        }
    } catch (e) {
        return false;
    }
}

const filterFilesFromRemove = (files, removeFiles) => {
    if(isArray(files) && isArray(removeFiles)){
        let newArr = [];
        for(let i = 0; i < files.length; i++){
            let isRemove = false;
            for(let x = 0; x < removeFiles.length; x++){
                if(files[i].file_name == removeFiles[x].file_name){
                    isRemove = true;
                    break;
                }
            }
            if(isRemove){
                removeFile(files[i].path);
            }else{
                newArr.push(files[i])
            }
        }
        return newArr;
    }else{
        return [];
    }
}


module.exports = {
    base64FileUpload,
    removeFile,
    filterFilesFromRemove,
    base64VideoFileUpload
}